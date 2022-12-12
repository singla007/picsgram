import { AUTH_TOKEN } from '../constants';

const authToken = localStorage.getItem(AUTH_TOKEN);

export default function IsloggedIn(){
    return !!authToken
}