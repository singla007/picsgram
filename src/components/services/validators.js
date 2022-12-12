export function validateEmail(email){
    const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (email && regex.test(email)){
        return true;
    }
    else {
        return false;
    }
}

export function validateUserName(userName){
    const regex = /^(?=.*[a-zA-Z\-]).{4,}$/;
    if ((userName.length > 0) && regex.test(userName)) {
        return true
    }
    else{
        return false;
    }

}

export function validatePassword(password){
    const regex = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%?=*&]).{8,30})$/i;
    if (password && regex.test(password)) {
        return true;
    }
    else{
        return false;
    }
}