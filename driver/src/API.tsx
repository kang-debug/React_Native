import axios from "axios";

const instance = axios.create({
    baseURL: 'http://10.32.11.236:3000',
    timeout : 10000
})


export default {
    login(id:string, pw:string){
        return instance.post('/driver/login',{userId: id, userPw: pw})
    },
    register(id:string,pw:string){
        return instance.post('/driver/register',{userId:id, userPw:pw})
    },
    list(id:string){
        return instance.post('/driver/list', {userId : id} )
    },
    accept(driverId:string, callId:string){
        return instance.post('/driver/accept',{driverId:driverId,callId:callId})
    }
}