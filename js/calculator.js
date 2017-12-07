// JavaScript Document
var	tabCount = 0;
var	currentTab = 1;
var	debugMode = 0;

var devices = window.devices;
var cntdevice = window.cntdevice;

var totalstandbycurrent = 0;
var total18current = 0;
var total13current = 0;
var total11current = 0;
var totaloffcurrent = 0;

var totalstandbycurrent_backup = 0;
var total18current_backup = 0;
var total13current_backup = 0;
var total11current_backup = 0;
var totaloffcurrent_backup = 0;

var totalstandbycurrent_nobackup = 0;
var total18current_nobackup = 0;
var total13current_nobackup = 0;
var total11current_nobackup = 0;
var totaloffcurrent_nobackup = 0;
	
var lang = window.location.hash;
lang = lang.replace("#","");
	
if (isEmpty(lang) && lang != "de" && lang != "en") {
	var lang = "en";
	}	
	
setTitle();

	
function setLang(l) {
	window.location.href ="index.html#"+l;
	window.location.reload();
	}
	
function setTitle() {
	document.title = window.translations[65][lang]
	}

function checkmax(elem,low,high,exit) {
	if (exit == true) {
		val = elem.value;
		elem.value = val.replace(",",".");
		elem.value = parseFloat(elem.value);
		}		
		if (elem.value < low || elem.value > high) {
			if (elem.value < low) { elem.value = low; }
			if (elem.value > high) { elem.value = high; }
			if(lang == 'en') { alert("Only values between "+low+" and "+high+" are allowed."); } 
			if(lang == 'de') { alert("Es sind nur Werte zwischen "+low+" und "+high+" erlaubt."); } 
			}
}



function resetTotals() {
	 totalstandbycurrent = 0;
	 total18current = 0;
	 total13current = 0;
	 total11current = 0;
	 totaloffcurrent = 0;
	
	 totalstandbycurrent_backup = 0;
	 total18current_backup = 0;
	 total13current_backup = 0;
	 total11current_backup = 0;
	 totaloffcurrent_backup = 0;
	
	 totalstandbycurrent_nobackup = 0;
	 total18current_nobackup = 0;
	 total13current_nobackup = 0;
	 total11current_nobackup = 0;
	 totaloffcurrent_nobackup = 0;
	}

	

function debug(text) {
		if (debugMode == true) {
			alert(text);
			}
	}

function toggleHelp() {
	for(i = 0; i <= tabCount;i++) {
		$('#help #part'+i).hide();	
		}
	$('#help #part'+currentTab).show();
	$('#help').fadeToggle('slow');	
	}
	
function tabInit() {
		tabCount = $('.tab').length;
		debug("count:"+tabCount+"\n current:"+currentTab);
		$('#btn-next').show();
		$('#btn-back').show();
		$('#btn-print').show();
		$('#tab'+currentTab).show();
		if (currentTab == 1) {
			$('#btn-back').hide();
			}	
		if (currentTab < tabCount) {
			$('#btn-print').hide();
			}		
	}

function tabNext() {
	currentTab += 1;
	tabInit();
	updatePagination();
	$('.tab').hide();
	if (tabCount == currentTab) {
			$('#btn-next').hide();
		} else {
			$('#btn-next').show();	
			}		
	$('#tab'+currentTab).show();
	if (currentTab == 3) {
		
		}
	if (currentTab == 4) {
			updateResult();
		}
	}
	
function tabBack() {
	currentTab -= 1;
	tabInit();
	updatePagination();
	$('.tab').hide();
	if (currentTab == 1) {
			$('#btn-back').hide();
		} else {
			$('#btn-back').show();	
			}		
		$('#tab'+currentTab).show();
	}
		
function updatePagination() {
	list = "<ul>";
	for(i=1;i<=tabCount;i++) {
		if (i == currentTab) { style = 'class="active"' } else { style = ' ' }
		list += '<li id="list'+i+'" '+style+'>'+i+'</li>';
		}
	list += "</ul>";
	$('#counter').html("");
	$('#counter').append(list);
	}
	

function isEmpty(mixed_var) { return (mixed_var == undefined || mixed_var === '' || mixed_var === 0 || mixed_var === '0' || mixed_var === null || mixed_var === false || (isArray(mixed_var) && mixed_var.length === 0));} 
function isArray(mixed_var) {return (mixed_var instanceof Array);} 

function myParseFloat(val) {
	var val = val.toString();
	var tmp = val.replace(",",".");
	var tmp = parseFloat(tmp);
	return tmp.toFixed(1);
}

function ampereRound(val) {
	var result = Math.round(val/100)*100;
	return result;
//return val;
	}
	
function updateResult() {
	var standbypower = 0;
	var burst = 0;
	
	var maxcurrent = 0;
	var currentconsumption = 0;
	var accucapacity = 0;
	
	
	if ($('#amplifiermode').val() == 1) {
		standbypower = totalstandbycurrent;
		}
		
	if ($('#amplifiermode').val() == 2) {
		standbypower = (totalstandbycurrent_backup * 0.1)+(totaloffcurrent_backup * 0.9)+totalstandbycurrent_nobackup;
		}
		
	if ($('#amplifiermode').val() == 3) {
		standbypower = totaloffcurrent;
		}
		
	if ($('#burstratio').val() == 1) {
		burst = total18current;	
		accucapacity = total18current;
	}
	if ($('#burstratio').val() == 2) {
		burst = total13current;	
		accucapacity = total13current;
	}
	if ($('#burstratio').val() == 3) {
		burst = total11current;
		accucapacity = total11current;	
	}
	
	if (accucapacity == 0) {
		maxcurrent = 1;
	} else {
		maxcurrent = Math.ceil(accucapacity / 100);		
	}
	mincapacity = ((parseFloat($('#emergencycurrenttime').val()) * standbypower) + (parseFloat($('#alarmemergencycurrenttime').val()) * burst)) * 1.25;
	
	if (mincapacity == 0) {
		currentconsumption = 1;
	} else {
		currentconsumption = Math.ceil(mincapacity / 372);
		}
		
	
	$('#result_mincapacity24v').html(myParseFloat(mincapacity));
	
	$('#result_standbytime').html(myParseFloat($('#emergencycurrenttime').val()));
	$('#result_alarmtime').html(myParseFloat($('#alarmemergencycurrenttime').val()));
	
	if (maxcurrent > currentconsumption) {
		var accu1 = maxcurrent; 
	} else {
		var accu1 = currentconsumption; 	
	}
	
	var j45 = (mincapacity / accu1) / 372;
	var k45 = parseInt(j45);
	var k44 = j45 - k45;
	var k43 = 0;
	if (k44 > 0.7) {
		k43 = 2;
	} else {
		k43 = 0;		
	}
	
	var accu2 = 0;
	if (k44 < 0.7) {
		accu2 = 2 * accu1;
	} else {
		accu2 = 0 * accu1;		
	}
	
	var accu3 = (2 * k45 + k43) * accu1;

	$('#result_accu1').html(parseInt(accu1));
	$('#result_accu2').html(parseInt(accu2));
	$('#result_accu3').html(parseInt(accu3));
	
	
	
	
	updatePrintResult();
	
	}
	
function updatePrintResult() {
	$('#print_projectname').html($('#projectname').val());
	$('#print_projectnumber').html($('#projectnumber').val());
	$('#print_creationdate').html($('#creationdate').val());
	$('#print_name').html($('#name').val());
	$('#print_email').html($('#email').val());
	$('#print_tel').html($('#tel').val());
	$('#print_fax').html($('#fax').val());
	
	$('#print_result_mincapacity24v').html($('#result_mincapacity24v').html());
	$('#print_result_standbytime').html($('#result_standbytime').html());
	$('#print_result_alarmtime').html($('#result_alarmtime').html());
	
	$('#print_result_accu1').html($('#result_accu1').html());
	$('#print_result_accu2').html($('#result_accu2').html());
	$('#print_result_accu3').html($('#result_accu3').html());
	
	
	///DEVICELIST UPDATE
	
	for(i=0;i<devices.length;i++) {
			$('#print_devicemainnumber'+i).html($('#devicemainnumber'+i).val());
			if (devices[i]["backupdevice"]) {
				$('#print_devicebackupnumber'+i).html($('#devicebackupnumber'+i).val());
			}
			$('#print_devicestandbycurrent'+i).html($('#devicestandbycurrent'+i).html()); 
			$('#print_device18current'+i).html($('#device18current'+i).html()); 
			$('#print_device13current'+i).html($('#device13current'+i).html()); 
			$('#print_device11current'+i).html($('#device11current'+i).html()); 
			$('#print_devicestandbycurrent'+i).html($('#devicestandbycurrent'+i).html()); 
		}
			$('#print_additionaldevicestandbycurrent'+i).html($('#additionaldevicestandbycurrent'+i).val()); 
			$('#print_additionaldevice18current'+i).html($('#additionaldevice18current'+i).val()); 
			$('#print_additionaldevice13current'+i).html($('#additionaldevice13current'+i).val()); 
			$('#print_additionaldevice11current'+i).html($('#additionaldevice11current'+i).val()); 

			$('#print_totaldevicestandbycurrent'+i).html($('#totaldevicestandbycurrent'+i).html()); 
			$('#print_totaldevice18current'+i).html($('#totaldevice18current'+i).html()); 
			$('#print_totaldevice13current'+i).html($('#totaldevice13current'+i).html()); 
			$('#print_totaldevice11current'+i).html($('#totaldevice11current'+i).html()); 	
	}
	
	
function updateDeviceCalculation(check) {
	resetTotals();
	for(i=0;i<devices.length;i++) {
		devices[i]["totaloffcurrent"] = 0;
		
		if (devices[i]["backupdevice"]) {
			if (check) {		
				$('#devicemainnumber'+i).val(parseInt($('#devicemainnumber'+i).val()));
				$('#devicebackupnumber'+i).val(parseInt($('#devicebackupnumber'+i).val()));
			}
			$("#devicestandbycurrent"+i).html(myParseFloat((parseInt($('#devicemainnumber'+i).val()) + parseInt($('#devicebackupnumber'+i).val())) * devices[i]["standbycurrent"]));
			devices[i]["totaloffcurrent"] = myParseFloat((parseInt($('#devicemainnumber'+i).val()) + parseInt($('#devicebackupnumber'+i).val())) * devices[i]["offcurrent"]);
		} else {
			if (check) {
				$('#devicemainnumber'+i).val(parseInt($('#devicemainnumber'+i).val()));
			}
			$("#devicestandbycurrent"+i).html(myParseFloat(($('#devicemainnumber'+i).val()) * devices[i]["standbycurrent"]));
			devices[i]["totaloffcurrent"] = myParseFloat((parseInt($('#devicemainnumber'+i).val())) * devices[i]["offcurrent"]);
			}

		$("#device18current"+i).html(myParseFloat(($('#devicemainnumber'+i).val()) * devices[i]["18current"]));
		$("#device13current"+i).html(myParseFloat(($('#devicemainnumber'+i).val()) * devices[i]["13current"]));
		$("#device11current"+i).html(myParseFloat(($('#devicemainnumber'+i).val()) * devices[i]["11current"]));
		
		totalstandbycurrent += parseFloat($("#devicestandbycurrent"+i).html());
		total18current += parseFloat($("#device18current"+i).html());
		total13current += parseFloat($("#device13current"+i).html());
		total11current += parseFloat($("#device11current"+i).html());
		totaloffcurrent += parseFloat(devices[i]["totaloffcurrent"]);
		if (devices[i]["backupdevice"]) {
			totalstandbycurrent_backup += parseFloat($("#devicestandbycurrent"+i).html());
			total18current_backup += parseFloat($("#device18current"+i).html());
			total13current_backup += parseFloat($("#device13current"+i).html());
			total11current_backup += parseFloat($("#device11current"+i).html());	
			totaloffcurrent_backup += parseFloat(devices[i]["totaloffcurrent"]);
		} else {
			totalstandbycurrent_nobackup += parseFloat($("#devicestandbycurrent"+i).html());
			total18current_nobackup += parseFloat($("#device18current"+i).html());
			total13current_nobackup += parseFloat($("#device13current"+i).html());
			total11current_nobackup += parseFloat($("#device11current"+i).html());	
			totaloffcurrent_nobackup += parseFloat(devices[i]["totaloffcurrent"]);
		}
	}
		
		totalstandbycurrent += parseFloat($("#additionaldevicestandbycurrent").val());
		total18current += parseFloat($("#additionaldevice18current").val());
		total13current += parseFloat($("#additionaldevice13current").val());
		total11current += parseFloat($("#additionaldevice11current").val());
		totaloffcurrent += parseFloat($("#additionaldevicestandbycurrent").val());
		totalstandbycurrent_nobackup += parseFloat($("#additionaldevicestandbycurrent").val());
		total18current_nobackup += parseFloat($("#additionaldevice18current").val());
		total13current_nobackup += parseFloat($("#additionaldevice13current").val());
		total11current_nobackup += parseFloat($("#additionaldevice11current").val());
		totaloffcurrent_nobackup += parseFloat($("#additionaldevicestandbycurrent").val());
		
	$('#totaldevicestandbycurrent').html(myParseFloat(totalstandbycurrent));
	$('#totaldevice18current').html(myParseFloat(total18current));
	$('#totaldevice13current').html(myParseFloat(total13current));
	$('#totaldevice11current').html(myParseFloat(total11current));	
	}
	
function buildDevicelist() {
	for(i=0;i<devices.length;i++) {
			var row = '<tr>';
			row += '<td class="tdleft">'+devices[i]["shortname"]+'</td>';
			row += '<td class="tdleft">'+devices[i]["ordernumber"]+'</td>';
			row += '<td class="tdleft">'+devices[i]["fullname"][lang]+'</td>';
			row += '<td><input type="text" id="devicemainnumber'+i+'" class="size2" value="0" onkeyup="updateDeviceCalculation(false);" onblur="updateDeviceCalculation(true);" /></td>';
			if (devices[i]["backupdevice"]) {
				row += '<td><input type="text" id="devicebackupnumber'+i+'" class="size2" value="0" onkeyup="updateDeviceCalculation(false);" onblur="updateDeviceCalculation(true);" /></td>';
			} else {
				row += '<td>&nbsp;</td>';
			}
			row += '<td id="devicestandbycurrent'+i+'">0.0</td>';
			row += '<td id="device18current'+i+'">0.0</td>';
			row += '<td id="device13current'+i+'">0.0</td>';
			row += '<td id="device11current'+i+'">0.0</td>';
			row += '</tr>';
			
			$('#devicebox').append(row);
			
			var printrow = '<tr>';
			printrow += '<td class="tdleft" nowrap="nowrap">'+devices[i]["shortname"]+'</td>';
			printrow += '<td class="tdleft" nowrap="nowrap">'+devices[i]["ordernumber"]+'</td>';
			printrow += '<td class="tdleft">'+devices[i]["fullname"][lang]+'</td>';
			printrow += '<td id="print_devicemainnumber'+i+'"></td>';
			if (devices[i]["backupdevice"]) {
				printrow += '<td id="print_devicebackupnumber'+i+'"></td>';
			} else {
				printrow += '<td>&nbsp;</td>';
			}
			printrow += '<td id="print_devicestandbycurrent'+i+'">0.0</td>';
			printrow += '<td id="print_device18current'+i+'">0.0</td>';
			printrow += '<td id="print_device13current'+i+'">0.0</td>';
			printrow += '<td id="print_device11current'+i+'">0.0</td>';
			printrow += '</tr>';
			
			
			$('#print_devicebox').append(printrow);
		}

			var row = '<tr>';
			row += '<td colspan="2">&nbsp;</td>';
			row += '<td class="tdleft">'+window.translations[63][lang]+'</td>';
			row += '<td colspan="2">&nbsp;</td>';
			row += '<td><input type="text" id="additionaldevicestandbycurrent" class="size2" value="0" onkeyup="updateDeviceCalculation(false);" onblur="updateDeviceCalculation(true);" /></td>';
			row += '<td><input type="text" id="additionaldevice18current" class="size2" value="0" onkeyup="updateDeviceCalculation(false);" onblur="updateDeviceCalculation(true);" /></td>';
			row += '<td><input type="text" id="additionaldevice13current" class="size2" value="0" onkeyup="updateDeviceCalculation(false);" onblur="updateDeviceCalculation(true);" /></td>';
			row += '<td><input type="text" id="additionaldevice11current" class="size2" value="0" onkeyup="updateDeviceCalculation(false);" onblur="updateDeviceCalculation(true);" /></td>';
			row += '</tr>';
			
			$('#devicebox').append(row);
			
			var printrow = '<tr>';
			printrow += '<td colspan="2">&nbsp;</td>';
			printrow += '<td class="tdleft">'+window.translations[63][lang]+'</td>';
			printrow += '<td colspan="2">&nbsp;</td>';
			printrow += '<td id="print_additionaldevicestandbycurrent"></td>';
			printrow += '<td id="print_additionaldevice18current"></td>';
			printrow += '<td id="print_additionaldevice13current"></td>';
			printrow += '<td id="print_additionaldevice11current"></td>';
			printrow += '</tr>';
			
			$('#print_devicebox').append(printrow);
			
			var row = '<tr class="result">';
			row += '<td colspan="2">&nbsp;</td>';
			row += '<td class="tdleft">'+window.translations[18][lang]+'</td>';
			row += '<td colspan="2">&nbsp;</td>';
			row += '<td id="totaldevicestandbycurrent">0.0</td>';
			row += '<td id="totaldevice18current">0.0</td>';
			row += '<td id="totaldevice13current">0.0</td>';
			row += '<td id="totaldevice11current">0.0</td>';
			row += '</tr>';
			
			$('#devicebox').append(row);	
			
			
			var printrow = '<tr class="result">';
			printrow += '<td colspan="2">&nbsp;</td>';
			printrow += '<td class="tdleft">'+window.translations[18][lang]+'</td>';
			printrow += '<td colspan="2">&nbsp;</td>';
			printrow += '<td id="print_totaldevicestandbycurrent">0.0</td>';
			printrow += '<td id="print_totaldevice18current">0.0</td>';
			printrow += '<td id="print_totaldevice13current">0.0</td>';
			printrow += '<td id="print_totaldevice11current">0.0</td>';
			printrow += '</tr>';
			
			$('#print_devicebox').append(printrow);		
	}
	
function init() {
	tabInit();
	updatePagination();
	buildDevicelist();
	$('#btn-back').addClass("back-"+lang);
	$('#btn-next').addClass("next-"+lang);
	$('#btn-print').addClass("print-"+lang);
	}
	
function p(i) {
	document.write(window.translations[i][window.lang]);
	}
	
