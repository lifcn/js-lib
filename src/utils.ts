import {
  EoneoCallback,
  EoneoError,
} from 'types/library'

export function createError(message: string): EoneoError {

  return {
    name: 'eoneo-exception',
    message,
  }
}

export function emitError(
  message: string | string[],
  callback?: EoneoCallback<any>,
) {
  let msg = message

  if (msg instanceof Array) {
    msg = msg.join(', ')
  }

  const error = createError(msg)

  if (typeof callback === 'function') {
    callback(error)
  } else if (Promise) {
    return Promise.reject(error)
  } else {
    return error
  }
}
