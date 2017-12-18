/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

 function handleFile(e,callback) {

	if (typeof e.files == 'undefined'||e.files.length ===0) {
		return;
	}

	var f = e.files[0];
	{
		var reader = new FileReader();
		var name = f.name;

		var nameSuffix=name.substring(name.lastIndexOf('.')+1) ;
		var rABS=true;
		console.log(name,nameSuffix);
		if (nameSuffix.toLowerCase() === 'csv') {
			reader.onload = function(e) {
				 var data = e.target.result;
				 console.log(data);
				 parseExcel(data,callback);
			};
			reader.readAsText(e.files[0],'GBK');
		}else if (nameSuffix.toLowerCase() === 'xls'||nameSuffix.toLowerCase() === 'xlsx'){
			reader.onload = function(e) {
				var data = e.target.result;
				var wb;

				if(rABS) {
					try {
						wb = XLSX.read(data, {type: 'binary'});
					} catch (e) {
						console.log('解析文件出错');

						var obj={
							result:false,
							reason:'解析文件出错'
						}
						callback(obj);
						return;
					} finally {

					}

				} else {
					try {
						var arr = fixdata(data);
						wb = XLSX.read(btoa(arr), {type: 'base64'});
					} catch (e) {
						console.log('解析文件出错');
						var obj={
							result:false,
							reason:'解析文件出错'
						};
						callback(obj);
						return;
					} finally {
					}
				}
				var excelData=wb.Sheets[wb.SheetNames[0]];
				excelData=XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0] ],{RS:'\r\n'});
				console.log(excelData);
				parseExcel(excelData,callback);
			};
			if(rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
		}
		else {
			var obj={
				result:false,
				reason:'导入格式只支持csv、xls、xlsx。'
			}
			callback(obj);
			return;
		}

	}
}

function fixdata(data) { //文件流转BinaryString
		var o = "",
				l = 0,
				w = 10240;
		for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
		o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
		return o;
}

function inputFileChange(){
	document.getElementById('parseBtn').click();
	console.log('inputFileChange');
}

function parseExcel(excelData,callback){
	var saveData=[];
	var rowDatas=excelData.split("\r\n");
	//排除EXCEL保存CSV文件时最后带空字符
	for(var j=0;j<rowDatas.length;j++){
			if(rowDatas[j]=='')
			rowDatas.splice(j,1);
	}
	if (rowDatas.length>0) {
		for(var k = 0; k < rowDatas.length; k ++) {
			var rData = [];
			rData = rowDatas[k].split(",");
			saveData.push(rData);
		}
	}
	var obj={
		result:true,
		data:saveData
	}
	callback(obj);
	console.log('saveData',saveData);

}

function cspManageProductFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		//删除掉上次的
		document.getElementById('csp_manage_product_delete_button').click();
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			//error
			document.getElementById('csp_manage_product_error_button').click();
		}
		else {
			//上传
			document.getElementById('csp_manage_product_right_button').click();
		}
	}
}

function cspManageSelectFile() {
	document.getElementById("csp_manage_file_input").click();
}

function cspManageAnalogFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		//删除掉上次的
		document.getElementById('csp_manage_analog_delete_button').click();
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			//error
			document.getElementById('csp_manage_analog_error_button').click();
		}
		else {
			//上传
			document.getElementById('csp_manage_analog_right_button').click();
		}
	}
}

function cspModuleFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			document.getElementById("csp_module_file_tips_label").innerText = "仅支持JPG,PNG,BMP格式的图片";
		}
		else {
			document.getElementById('csp_module_file_commit').click();
		}
	}
}

function cspManageImportLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_import_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_import_file_load_btn').click();
		}
	}
}

 function cspCustomerImportLoadFileChange (obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();

		}


		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
      document.getElementById('csp_customer_import_file_error_btn').click();

		}
		// else {
		// 	document.getElementById('csp_manage_import_file_load_btn').click();
		// }
	}
}





function cspModuleImgLoad(obj) {
	if(obj.width > obj.height ) {
		obj.style.width = "auto";
		obj.style.height = "150px";
	}
	else {
		obj.style.width = "150px";
		obj.style.height = "auto";
	}
	//设置上下左右居中
	var left = (150 -obj.width)/2 + "px";
	var top = (150-obj.height)/2 + "px";
	obj.style.marginLeft = left;
	obj.style.marginTop = top;

}

function cspModuleBigImgLoad(obj) {


	if(obj.width >= window.innerWidth && obj.height < window.innerHeight) {

		obj.style.width = "100%";
		obj.style.height = "auto";
	}
	if(obj.width >= window.innerWidth && obj.height >= window.innerHeight) {
		if((obj.width*1000/window.innerWidth) > (obj.height*1000/window.innerHeight)) {

			obj.style.width = "100%";
			obj.style.height = "auto";
		}
		else {

			obj.style.width = "auto";
			obj.style.height = "100%";
		}
	}
	if(obj.width < window.innerWidth && obj.height >= window.innerHeight) {

		obj.style.width = "auto";
		obj.style.height = "100%";
	}
	var left = (-obj.width)/2 + "px";
	var top = (-obj.height)/2 + "px";

	obj.style.marginLeft = left;
	obj.style.marginTop = top;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
Date.prototype.Format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}

function cspManageThemesMouseOver(obj) {
	obj.style.backgroundColor = "#d5d5d5";
}

function cspManageThemesMouseOut(obj) {
	obj.style.backgroundColor = "white";
}


function getMinimum(arr,start,end){
	start=start||0;
	end=end||arr.length;

	var min=arr[start];
	for (var i = start; i < end; i++) {
		if(min>arr[i])
			min=arr[i];
	}
	return min;
}

//主要用于图表的显示,默认
function getMaximum(arr,start,end){
	start=start||0;
	end=end||arr.length;

	var max=arr[start];
	for (var i = start; i < end; i++) {
		if(max<arr[i])
			max=arr[i];
	}
	return max;
}

function cspManageSpotLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_spot_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_spot_file_load_btn').click();
		}
	}
}

function cspManageFuturesLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(0);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_futures_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_futures_file_load_btn').click();
		}
	}
}


//分页算法,current表示当前的，length表示总的页数，displayLength表示一次显示的分页数
function calculateIndexes(current, length, displayLength) {
 var indexes = [];
	current=current>length?length:current;

 var start = Math.round(current - displayLength / 2);
 var end =   Math.round(current + displayLength / 2);

 if (start < 1) {
		 start = 1;
 }
 if (end !=start+displayLength-1) {
		 end = start+displayLength - 1 ;
 }
 if(end>length)
	 end=length;

 if(end-displayLength+1<start){
	 start=end-displayLength+1>0?end-displayLength+1:1;
 }

 for (var i = start; i <= end; i++) {
	 var obj={};
	 obj.page=i;
	 if (i==current) {
		 obj.select=true;
	 }else {
		 obj.select=false;
	 }
	 indexes.push(obj);
 }

 return indexes;
 }

 //操作登录界面背景图片
 function cspOperLoginBgChange() {
	 if(window.innerHeight <= 400) {
		 document.getElementById("csp_oper_login_html").style.height = "400px";
	 }
	 else {
		 document.getElementById("csp_oper_login_html").style.height = "100%";
	 }
 }



 //新建公告选择文件
 function cspManageNewNoticeFileChange(obj) {
	 var filename = obj.value;
 	if(filename === "") {
 		//删除掉上次的
 		document.getElementById('csp_manage_newnotice_file_delete_button').click();
 	}
 	else {
 		var file = filename.substring(0);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
			if(kind === "pdf") {
				document.getElementById('csp_manage_newnotice_file_right_button').click();
			}
 		}
 	}
 }

 //导入用户选择文件
 function cspManageLoadUserLoadFileChange(obj) {
	 var filename = obj.value;
 	if(filename === "") {
 	}
 	else {
 		var file = filename.substring(0);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
 		}
 		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
 			document.getElementById('csp_manage_futures_file_error_btn').click();
 		}
 		else {
 			document.getElementById('csp_manage_futures_file_load_btn').click();
 		}
 	}
 }

 //导入已购产品选择文件
 function cspManageLoadBoughtLoadFileChange(obj) {
	 var filename = obj.value;
   	 if(filename === "") {
     }
   	 else {
	    var file = filename.substring(0);
	    var filekindarr = filename.split(".");
	    var kind = "";
	    if(filekindarr.length > 1) {
		    kind = filekindarr[filekindarr.length -1].toLowerCase();
	    }
	    if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
		    document.getElementById('csp_manage_loadbought_file_error_btn').click();
	    }
	    else {
		    document.getElementById('csp_manage_loadbought_file_load_btn').click();
	    }
    }
 }


 //传入最大值,返回设置图表的最大值和分段间隔
 var getMaxAndInterval = function(max)
 {
 	var splitNumber=5;//分割的块数
 	var interval=max/splitNumber;
 	var newinterval = interval;
 	var n = 0;

 	//获取数的十为底的次数,1为0,0.1为0
 	if(interval < 1)
 	{
 		var n = 1;
 		while(interval < 1)
 		{
 			interval = interval*10;
 			n = n - 1;
 		}
 	}
 	else
 	{
 		while(interval >= 1)
 		{
 			interval = interval/10;
 			n = n + 1;
 		}
 	}


 	newinterval = Math.ceil(newinterval/Math.pow(10,n-1))*Math.pow(10,n-1);

 	if (Math.abs(n)+1<=20) {
 		n=Math.abs(n)+1;
 	}
	else{
		n=20;
	}
 	newinterval = parseFloat(newinterval.toFixed(n));

 	if(max >= newinterval*splitNumber - 0.5*newinterval)
 	{
 		max = newinterval * (splitNumber + 1);
 		splitNumber = splitNumber + 1;
 	}
 	else
 	{
 		max = newinterval*splitNumber;
 	}
	max = parseFloat(max.toFixed(n));

 	var obj={};
 	obj.max=max;
 	obj.interval=newinterval;

 	return obj;
 }

 var getMaxAndMinInterval = function(max,min)
 {
	 if (max === min) {
	 	min=0;
	 }

 	var splitNumber=5;//分割的块数
 	var interval=(max-min)/splitNumber;
 	var newinterval = interval;
 	var n = 0;

	if (newinterval<0.01) {
		newinterval=0.01;

		var startPoint=Math.floor(min/newinterval)*newinterval;
		var endPoint=startPoint+splitNumber*newinterval;
		if (min-startPoint <0.5*newinterval&&startPoint-newinterval>=0) {
			startPoint-=newinterval;
		}
		while(endPoint-max < 0.5*newinterval){
			endPoint+=newinterval;
		}


		startPoint = parseFloat(startPoint.toFixed(2));
		endPoint= parseFloat(endPoint.toFixed(2));

		var obj={};
		obj.max=endPoint;
		obj.min=startPoint;
		obj.interval=newinterval;

		return obj;
	}

 	//获取数的十为底的次数,1为0,0.1为0
 // 	if(interval < 1)
 // 	{
 // 		var n = 1;
 // 		while(interval < 1)
 // 		{
 // 			interval = interval*10;
 // 			n = n - 1;
 // 		}
 // 	}
 // 	else
 // 	{
 // 		while(interval >= 1)
 // 		{
 // 			interval = interval/10;
 // 			n = n + 1;
 // 		}
 // 	}
	//
	//
	// //对当前位数采用进一法
 // 	newinterval = Math.round(newinterval/Math.pow(10,n-1))*Math.pow(10,n-1);

	if (interval < 1) {
		while(interval < 1){
			interval = interval*10;
			n = n - 1;
		}
	}else{
		while(interval >= 10)
		{
			interval = interval/10;
			n = n + 1;
		}
	}
	newinterval = Math.round(newinterval/Math.pow(10,n))*Math.pow(10,n);

	if (Math.abs(n)+1<=20) {
		n=Math.abs(n)+1;
	}
	else{
		n=20;
	}

	if ((max-min)>splitNumber*newinterval) {
		while((max-min)>splitNumber*newinterval){
			newinterval+=0.5*newinterval;
		}
		newinterval = parseFloat(newinterval.toFixed(n+1));

	}
	else {
		newinterval = parseFloat(newinterval.toFixed(n));
	}


	var startPoint=Math.floor(min/newinterval)*newinterval;
	var endPoint=startPoint+splitNumber*newinterval;
	if (min-startPoint <0.5*newinterval&&startPoint-newinterval>=0) {
		startPoint-=newinterval;
	}
 	while(endPoint-max < 0.5*newinterval){
 		endPoint+=newinterval;
 	}


	startPoint = parseFloat(startPoint.toFixed(n));
	endPoint= parseFloat(endPoint.toFixed(n));

 	var obj={};
 	obj.max=endPoint;
	obj.min=startPoint;
 	obj.interval=newinterval;

 	return obj;
 }

 //导入操作员选择文件
 function cspOperManageLoadOperFileChange(obj) {
	 var filename = obj.value;
   	 if(filename === "") {
     }
   	 else {
	    var file = filename.substring(0);
	    var filekindarr = filename.split(".");
	    var kind = "";
	    if(filekindarr.length > 1) {
		    kind = filekindarr[filekindarr.length -1].toLowerCase();
	    }
	    if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
		    document.getElementById('csp_oper_manage_load_oper_error_btn').click();
	    }
	    else {
		    document.getElementById('csp_oper_manage_load_oper_file_load_btn').click();
	    }
    }
 }

 //field表示对象的父节点字段
	function foldTree(destObj,index,sourceArr,field){
	 if (destObj.type === 'product') {
		 destObj.showChild=!destObj.showChild;
		 for (var i = index+1; i < sourceArr.length; i++) {
			 if (destObj[field] === sourceArr[i][field]) {
				 sourceArr[i].show=destObj.showChild;
			 }
			 else {
				 break;
			 }
		 }
	 }else {
		 for (var i = index+1; i < sourceArr.length; i++) {
			 if (destObj[field] === sourceArr[i][field]) {
				 sourceArr[i].show=false;
			 }
			 else {
				 break;
			 }
		 }

		 for (var i = index; i >=0; i--) {
			 if (destObj[field] === sourceArr[i][field]) {
				 if (sourceArr[i].type === 'product') {
					 sourceArr[i].showChild=!sourceArr[i].showChild;
				 }
				 else {
						 sourceArr[i].show=false;
				 }

			 }
			 else {
				 break;
			 }
		 }
	 }
	 console.log(sourceArr);
 }


  function scrollHead(containerStr,headStr) {
   var container = document.getElementById(containerStr);
   var headtb = document.getElementById(headStr);

   if(container.scrollTop >= 0) {
     headtb.style.top = container.scrollTop+ "px";
   }
 }


 function formatMoney(s, n){
   if (typeof s =='undefined' || s== null ||(typeof s== 'string' && s== '')) {
     return '0';
   }
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, ""));
    if (isNaN(s)) {
      return '';
    }

    s=s.toFixed(n) ;

    var result='';
    if (s[0] == '-') {
      result='-';
      s=s.slice(1);
    }
    s=s.split(".");
    var integerStr = s[0];//整数部分
    var decimalsStr = s[1];//小数部分

    result+=toThousands(integerStr)+'.'+decimalsStr;
   //  console.log('integerStr',result);
    return result;
 }


 function toThousands(num) {
   var num = (num || 0).toString(), result = '';
   while (num.length > 3) {
       result = ',' + num.slice(-3) + result;
       num = num.slice(0, num.length - 3);
   }
   if (num) { result = num + result; }
   return result;
 }

 function cspImportRecordsLoadFileChange(obj) {
     var filename = obj.value;
 	if(filename === "") {
 		//删除掉上次的
        document.getElementById('csp_import_records_load_empty_btn').click();
 	}
 	else {
 		var file = filename.substring(0);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
 		}
 		if(!(kind === "csv" || kind === "xls" || kind === "xlsx")) {
 			//error
 			document.getElementById('csp_import_records_load_error_btn').click();
 		}
 		else {
 			//上传
 			document.getElementById('csp_import_records_load_right_btn').click();
 		}
 	}
 }
