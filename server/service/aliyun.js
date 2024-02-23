/*!
 * index.js
 * @desc: 发送短信
 * @author: panda.club
 * @date: 2018/11/25
 */

'use strict';

import Core from '@alicloud/pop-core';
const runtimeConfig = useRuntimeConfig();

const {
	aliyunId,
	aliyunSecret
} = runtimeConfig;

/**
 * 发送短信
 * @param mobile
 * @param templateCode
 * @param data
 * @returns {Promise<any>}
 */
export async function sendSms (mobile, templateCode, data) {
	var client = new Core({
		accessKeyId: aliyunId,
		accessKeySecret: aliyunSecret,
		endpoint: 'https://dysmsapi.aliyuncs.com',
		apiVersion: '2017-05-25'
	});

	const params = {
		"RegionId": "cn-hangzhou",
		"PhoneNumbers": mobile,
		"SignName": "二零四五",
		"TemplateCode": templateCode,
		"TemplateParam": JSON.stringify(data)
	};

	const requestOption = {
		method: 'POST'
  };
  
  try{
    const result = await client.request('SendSms', params, requestOption);
	  return result;
  }catch(err) {
    return err.data || null;
  }
}

/**
 * 发送验证码
 */
export async function sendVerifyCode (params) {
	const templateCode = 'SMS_186565235';
	const {mobile, code} = params;
	return await sendSms(mobile, templateCode, {
		code: code
	});
}

/**
 * 免密登录获取手机号
 */
export async function getMobileByToken (token) {
	const client = new Core({
		accessKeyId: aliyunId,
		accessKeySecret: aliyunSecret,
		endpoint: 'https://dypnsapi.aliyuncs.com',
		apiVersion: '2017-05-25'
	});

	const params = {
		"AccessToken": token,
	};

	const requestOption = {
		method: 'POST'
  };
  
  try{
    const result = await client.request('GetMobile', params, requestOption);
		const {Code, Message, GetMobileResultDTO} = result;
		if(Message === 'OK') {
			return GetMobileResultDTO.Mobile
		}
	  return null;
  }catch(err) {
		console.log(err);
    return err.data || null;
  }
}

export async function checkTextGreen (text) {
	try {
		const client = new Core({
			accessKeyId: aliyunId,
			accessKeySecret: aliyunSecret,
			endpoint: 'https://green-cip.cn-shanghai.aliyuncs.com',
			apiVersion: '2022-03-02'
		});
		const requestOption = {
			method: 'POST',
			formatParams: false,
		};

		const res = await client.request('TextModeration', {
			"Service": "comment_detection",
			"ServiceParameters": JSON.stringify({
				content: text
			})
		}, requestOption);
		const {Code, Data} = res;

		console.log(text, '-----' ,JSON.stringify(res));
		if(Code !== 200) {
			return '系统错误，请重试'
		} else {
			if(Data.labels && Data.labels.length > 0) {
				return false;
			}
			return 'ok';
		}
		return res;
	} catch (err) {
		return false
	}
}