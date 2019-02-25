function addQueryParamToUrlAndReload(param, value){
	var url = window.location.href;
	if(url.lastIndexOf('#') == (url.length-1))
	{
		url = url.substring(0, url.length-1)
	}
	if (url.indexOf('?') > -1){
	   url += '&'+param+'='+value;
	}else{
	   url += '?'+param+'='+value;
	}
	window.location.href = url;
}

function getValueFromQueryParam(paramName){
    const Window = require('window');
    const window = new Window();
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars[paramName];
}

function addOptionsToSelect(optionsArray, parentId){
	if(optionsArray && optionsArray.length > 0) {
		var select = document.getElementById(parentId);
		for(var i=0; i<optionsArray.length; i++) {
			var option = document.createElement("option");
			option.text = optionsArray[i];
			select.add(option);
	    }
	}
}

function addOptionsToSelectViaElem(optionsArray, elem){
	if(optionsArray && optionsArray.length > 0) {
		for(var i=0; i<optionsArray.length; i++) {
			var option = document.createElement("option");
			option.text = optionsArray[i];
			elem.add(option);
	    }
	}
}

function cloneDOM(elemToClone, parentElem){
	parentElem.append(elemToClone.clone());
}

function getFileValue(){
	/*jQuery.get('js/Extras.txt').done(function(txt){
		console.log("txt", txt);
	});*/
	
	$.ajax({
        headers: { "Accept": "application/json"},
        type: 'GET',
        url: 'data/Extras.txt',
        crossDomain: true,
        beforeSend: function(xhr){
            xhr.withCredentials = true;
      },
        success: function(data, textStatus, request){
            console.log("123" + data);
        }
	});

}

module.exports.getValueFromQueryParam = getValueFromQueryParam;