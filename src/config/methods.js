
import React from 'react';
import { env } from '@/config/env/';
const { HOST, serverEnv } = env;
function Guid() {//动态生成id
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16).substring(1);
	}
	return {
		newguid: function () {
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		}
	}
}
function Trim(str, is_global) {
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");
	if (is_global.toLowerCase() == "g") {
		result = result.replace(/\s/g, "");
	}
	return result;
}

function isRepeat(arr) {//判断数组中的重复数据

	var hash = {};

	for (var i in arr) {

		if (hash[arr[i]])

			return true;

		hash[arr[i]] = true;

	}

	return false;
}
// 数值减法
function accSub(arg1, arg2) {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);

	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	}
	catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	}
	catch (e) {
		r2 = 0;
	}
	n = Math.max(r1, r2);
	m = Math.pow(10, n); //last modify by deeka //动态控制精度长度
	return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}
// 给Number类型增加一个mul方法，调用起来更加方便。如：Number(2).sub(1)=>1
Number.prototype.sub = function (arg) {
	return accSub(this, arg);
};

// 数值加法
function accAdd(arg1, arg2) {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);
	var r1, r2, m, c;
	try {
		r1 = arg1.toString().split(".")[1].length;
	}
	catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	}
	catch (e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if (c > 0) {
		var cm = Math.pow(10, c);
		if (r1 > r2) {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", "")) * cm;
		} else {
			arg1 = Number(arg1.toString().replace(".", "")) * cm;
			arg2 = Number(arg2.toString().replace(".", ""));
		}
	} else {
		arg1 = Number(arg1.toString().replace(".", ""));
		arg2 = Number(arg2.toString().replace(".", ""));
	}
	return Number((arg1 + arg2) / m);
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
	return accAdd(this, arg);
};

/**
** 乘法函数，用来得到精确的乘法结果
** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
** 调用：accMul(arg1,arg2)
** 返回值：arg1乘以 arg2的精确结果
**/
function accMul(arg1, arg2) {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);

	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	}
	catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	}
	catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
	return accMul(this, arg);
};

// // 发送
// if (envRouter) { //预发环境
// 	this.props.history.push({ pathname: '/DecorationOrder', query: data });
// } else {

// }

// // 接收
// if (envRouter) { //预发环境
// 	const data = this.props.location.query;
// 	// console.log(data);
// 	if (data) {

// 	}
// } else {

// }

const envRouter = (function envReceive(event) {
	if (serverEnv === 'prepub') return true
	// if (true) return true
	else return false
})()

export {
	Guid,
	Trim,
	isRepeat,
	accSub,
	accAdd,
	accMul,
	envRouter,
}