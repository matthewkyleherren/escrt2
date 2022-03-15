(function (a) {
if (a) {
var b=document.createElement('div');
b.className='naughty-browser';
var c='<p>Your web browser is no longer supported. Our web site may not function as intended.</p>';
c+=(a[0]!=='Edge')?'<p>Please <a href="microsoft-edge:'+window.location.href+'">try using Microsoft Edge</a>, the latest browser from Microsoft.</p>':'';
c+='<p><a href="https://browsehappy.com/" target="_blank" rel="noopener">Visit browsehappy.com</a> for information on other modern web browsers.</p>';
b.innerHTML=c;
document.body.appendChild(b);
}
}(/MSIE|rv:11|Edge/.exec(navigator.userAgent)));
