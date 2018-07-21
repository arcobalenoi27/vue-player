export const ajax = (method, api, dataToPass, callback, self) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        self.res = JSON.parse(xhr.responseText);
        console.log('data received');
        if(typeof callback === 'function') {
            callback(self)
        }
      }
    }
    xhr.open(method, api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    if(method === 'GET') {
        xhr.send();
    } else {
        xhr.send(dataToPass);
    }
}