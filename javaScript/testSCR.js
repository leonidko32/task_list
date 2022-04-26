
function sendRequest(method, url, body = null,id=""){
    const secondFetchArgument = {};
    if(method === "POST" || "PUT"||"DELETE"){
        secondFetchArgument.method = method,
        secondFetchArgument.body = JSON.stringify(body),
        secondFetchArgument.headers = {
        "Content-Type" : "application/json;charset=UTF-8"
        }  
    }
        if(method === "PUT"||"DELETE"){
            url=url+'/'+id;
        }
  
    if(method === "GET"){
        return fetch(url)
        .then(response=>response.json() )
    }else{
    return fetch(url , secondFetchArgument)
    .then(response=>response.json() )
    }        
    
}




// sendRequest('GET', urlTasks)
// .then(data=>console.log(data))
// .catch(err=>console.log(err))


