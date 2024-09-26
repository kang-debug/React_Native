import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Modal, Animated, Easing } from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";

const sentences = [
    "HelloWorld",
    "DCU",
    "Apple",
    "Banana",
    "LeagueofLegend",
    "Basketball",
    "Oracle",
    "Happy",
    "wdhjlkdawd",
    "dqweqeawda"
];

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
const upperCaseRegex = /[A-Z]/;
const lowerCaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

function Task(): JSX.Element {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userPw2, setUserPw2] = useState('');
    const [previewSentence, setPreviewSentence] = useState(''); 
    const [userSentenceInput, setUserSentenceInput] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [idError, setIdError] = useState<string[]>([]);
    const [pwError, setPwError] = useState<string[]>([]);
    const [pw2Error, setPw2Error] = useState('');
    const [sentenceError, setSentenceError] = useState(''); 

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const spinValue = new Animated.Value(0);  

    const startSpinner = () => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const validateId = () => {
        let errors = [];

        if (!userId) {
            errors.push('아이디는 필수 입력입니다.');
        } else {
            if (hangulRegex.test(userId)) {
                errors.push('한글 사용 불가');
            }
            if (!isNaN(userId.charAt(0))) {
                errors.push('첫 단어에 숫자 사용 불가');
            }
        }

        setIdError(errors);
        return errors.length === 0;
    };

    const validatePw = () => {
        let errors = [];

        if (!userPw) {
            errors.push('비밀번호는 필수 입력입니다.');
        } else {
            if (userPw.length < 10 || userPw.length >= 16) {
                errors.push('비밀번호는 10자리 이상 16자리 미만이어야 합니다.');
            }
            if (!specialCharRegex.test(userPw) || (userPw.match(specialCharRegex) || []).length < 2) {
                errors.push('서로 다른 특수문자 2개 이상 포함해야 합니다.');
            }
            if (!upperCaseRegex.test(userPw) || !lowerCaseRegex.test(userPw) || !numberRegex.test(userPw)) {
                errors.push('영문 대문자, 소문자, 숫자를 포함해야 합니다.');
            }
            if (hangulRegex.test(userPw)) {
                errors.push('한글 사용 불가');
            }
            if (userPw === userId) {
                errors.push('아이디와 비밀번호는 동일할 수 없습니다.');
            }
            if (userPw.includes(userId) && userId.length >= 5) {
                errors.push('비밀번호에 아이디와 5자리 이상 동일한 부분을 포함할 수 없습니다.');
            }
        }

        setPwError(errors);
        return errors.length === 0;
    };

    const validatePw2 = () => {
        let error = '';

        if (!userPw || pwError.length > 0) {
            error = '비밀번호를 먼저 지정하세요';
        } 
        else{
            if (!userPw2) {
                error = '필수 입력입니다.';
            } else if (userPw !== userPw2) {
                error = '비밀번호가 일치하지 않습니다.';
            }
        }
        setPw2Error(error);
        return error === '';
    };

    const validateSentence = () => {
        if (previewSentence && previewSentence !== userSentenceInput) {
            setSentenceError('문장을 정확히 입력하세요.');
            setUserSentenceInput('');
            return false;
        }
        setSentenceError('');
        return true;
    };

    const handleRegister = () => {
        const isIdValid = validateId();
        const isPwValid = validatePw();
        const isPw2Valid = validatePw2();

        if (isIdValid && isPwValid && isPw2Valid && !previewSentence) {
            generateRandomSentence();
        } else if (previewSentence) {
            const isSentenceValid = validateSentence();

            if (isSentenceValid) {
                setIsLoading(true); 
                startSpinner(); 
                setTimeout(() => {
                    setIsLoading(false); 
                    console.log('회원가입 성공');
                    navigation.navigate('Login'); 
                }, 2000); 
            }
        }
        else {
            setUserId('');
            setUserPw('');
            setUserPw2('');
            setUserSentenceInput('');
        }

        
    };

    const generateRandomSentence = () => {
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        setPreviewSentence(randomSentence);
        setUserSentenceInput(''); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.container, { justifyContent: 'flex-end' }]}>
                <Icon name="taxi" size={80} color={'#3498db'} />
            </View>

            {!previewSentence && (
                <View style={[styles.container, { flex: 2 }]}>
                    <TextInput
                        style={styles.input}
                        placeholder={'ID'}
                        value={userId}
                        onChangeText={newId => setUserId(newId)}
                    />
                    {idError.length > 0 &&
                        idError.map((error, index) => (
                            <Text key={index} style={styles.errorText}>{error}</Text>
                        ))}

                    <TextInput
                        style={styles.input}
                        placeholder={'Password'}
                        value={userPw}
                        onChangeText={newPw => setUserPw(newPw)}
                        secureTextEntry={true}
                    />
                    {pwError.length > 0 &&
                        pwError.map((error, index) => (
                            <Text key={index} style={styles.errorText}>{error}</Text>
                        ))}

                    <TextInput
                        style={styles.input}
                        placeholder={'Repeat Password'}
                        value={userPw2}
                        onChangeText={newPw2 => setUserPw2(newPw2)}
                        secureTextEntry={true}
                    />
                    {pw2Error ? <Text style={styles.errorText}>{pw2Error}</Text> : null}
                </View>
            )}

            {previewSentence && (
                <View style={[styles.container, { flex: 2 }]}>
                    <Text style={styles.previewText}>미리보기: {previewSentence}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="위 문장을 입력하세요"
                        value={userSentenceInput}
                        onChangeText={setUserSentenceInput}
                    />
                    {sentenceError ? <Text style={styles.errorText}>{sentenceError}</Text> : null}
                </View>
            )}

            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent={true} visible={isLoading}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Icon name="spinner" size={50} color="#3498db" />
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        width: '70%',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    input: {
        width: '70%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 10,
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 5,
    },
    previewText: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 10,
        color: 'gray',
    },
});

export default Task;
