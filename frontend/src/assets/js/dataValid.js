//Created by ZYR
var username;

export function usernameValid (rule, value, callback) 
{     
    if (!/^([a-zA-Z]|\-)[A-Za-z0-9_\-]+/.test(value)) {      
        callback(new Error('Please input correct username: you can only use what no one used'))
    } else {      
        username = value;
        callback()   
    }  
}
export function passwordValid (rule, value, callback) 
{  
    if (!/(?!^(\d+|[a-zA-Z]+|\-+)$)^[\w\-]/.test(value)) {      
        callback(new Error('Please input correct password:it can only contain letters、number and underline'))
    } else if(username != undefined && value.indexOf(username) != -1){      
        callback(new Error("Password can not contain username"))   
    }  
    else{
        callback();
    }
}
export function emailValid (rule, value, callback) 
{    
    if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value)) {      
        callback(new Error('Please input correct email'))    
    } else {      
        callback()   
    }  
}
export function timeValid (rule, value, callback) 
{    
    if (!/^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/.test(value)) {      
        callback(new Error('Please input correct time'))    
    } else {      
        callback()   
    }  
}
export function placeeValid (rule, value, callback) 
{    
    if (!/.*，.*/.test(value)) {      
        callback(new Error('Please input correct place'))    
    } else {      
        callback()   
    }  
}
