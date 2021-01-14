export default function padZeros(num, digits) {
  let currDigits = num.toString().length;
  return currDigits >= digits ? num : new Array(digits - currDigits + 1).join('0') + num;
}
