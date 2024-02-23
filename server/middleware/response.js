'use strict';

function success (code = 0, message = 'SUCCESS', data) {
  if (typeof code === 'object') {
    data = code;
    message = 'SUCCESS';
    code = 0;
  }

  if (typeof code === 'string') {
    if(message) {
      data = message;
    }
    message = code;
    code = 0;
  }

  return {
    data,
    status: {
        code,
        message
    }
  }
}

function error (code = -1, message = 'ERROR', data) {
  if (typeof code === 'object') {
    data = code;
    message = 'ERROR';
    code = -1;
  }

  if (typeof code === 'string') {
    if(message) {
      data = message;
    }
    message = code;
    code = -1;
  }

  return {
    data,
    status: {
        code,
        message
    }
  }
}

export default defineEventHandler((event) => {
  // console.log('接口请求: ' + event.node.req.url);
  event.context.success = success;
  event.context.error = error;
})