export default {

    data: () => {
        return {
            baseKey: '',
            keyStr :"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            pcount: ''
        }
    },
    mounted(){

        this.rndStr(4).then((str)=>{
            this.baseKey=str;

        });


    },
    methods: {
        rndStr(len){
            return new Promise((resolved, reject)=>{
            let text = "";
            let chars = "bnopqrstcdefghavwxyzijklmu";

            for( let i=0; i < len; i++ ) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
                if(i==len-1)
                    resolved(text)
            }
            });
        },
        encrypt(strEncrypt) {
            var vm = this
            var v = new Array(2);
            var k = new Array(4);
            var s = "";
            var i = "";
            var plaintext = vm.escCtrlCh(strEncrypt);
            var password = this.baseKey;
            for (var i = 0; i < 4; i++)
                k[i] = vm.Str4ToLong(password.slice(i * 4, (i + 1) * 4));
            for (i = 0; i < plaintext.length; i += 8) {
                v[0] = vm.Str4ToLong(plaintext.slice(i, i + 4));
                v[1] = vm.Str4ToLong(plaintext.slice(i + 4, i + 8));
                vm.code(v, k);
                s += vm.LongToStr4(v[0]) + vm.LongToStr4(v[1]);
            }
            var input = vm.escCtrlCh(s);
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output +=
                    vm.keyStr.charAt(enc1) +
                    vm.keyStr.charAt(enc2) +
                    vm.keyStr.charAt(enc3) +
                    vm.keyStr.charAt(enc4);
            }
            return output;
            //this.decrypt(output);
        },
        decrypt(strDesEncrypt){
            var vm = this
            var input = strDesEncrypt;
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = vm.keyStr.indexOf(input.charAt(i++));
                enc2 = vm.keyStr.indexOf(input.charAt(i++));
                enc3 = vm.keyStr.indexOf(input.charAt(i++));
                enc4 = vm.keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output+=String.fromCharCode(chr1);
                if (enc3 != 64) {output+=String.fromCharCode(chr2);}
                if (enc4 != 64) {output+=String.fromCharCode(chr3);}}
            output = output.toString();
            var v = new Array(2);
            var k = new Array(4);
            var s = '';
            var i = '';
            var ciphertext = vm.unescCtrlCh(output);
            var password = this.baseKey;
            for(var i=0;i<4;i++) k[i] = vm.Str4ToLong(password.slice(i*4,(i+1)*4));
            for(i=0; i<ciphertext.length; i+=8) {
                v[0] = vm.Str4ToLong(ciphertext.slice(i,i+4));
                v[1] = vm.Str4ToLong(ciphertext.slice(i+4,i+8));
                vm.decode(v, k);
                s += vm.LongToStr4(v[0]) + vm.LongToStr4(v[1]);}
            s = s.replace(/\0+$/, '');
            console.log('desEncrytp '+vm.unescCtrlCh(s));

        },
        Str4ToLong(s){
            var v = 0;
            for(var i=0; i<4; i++) v |= s.charCodeAt(i) << i*8;
            return isNaN(v) ? 0 : v;},
        LongToStr4(v){
            var s = String.fromCharCode(v & 0xFF, v>>8 & 0xFF, v>>16 & 0xFF, v>>24 & 0xFF);
            return s;},
        escCtrlCh(str){
            return str.replace(/[\0\t\n\v\f\r\xa0'"!]/g, function(c) { return '!' + c.charCodeAt(0) + '!'; });},
        unescCtrlCh(str){
            return str.replace(/!\d\d?\d?!/g, function(c) { return String.fromCharCode(c.slice(1,-1)); });},
        code(v,k){
            var y = v[0],
                z = v[1];
            var delta = 0x9E9779B3;
            var limit = delta*32;
            var sum = 0;
            while(sum != limit){
                y += (z<<4 ^ z>>>5)+z ^ sum+k[sum & 3];
                sum += delta;
                z += (y<<4 ^ y>>>5)+y ^ sum+k[sum>>>11 & 3];}
            v[0] = y; v[1] = z;},
        decode(v,k){
            var y = v[0],
                z = v[1];
            var delta = 0x9E9779B3;
            var sum = delta*32;
            while(sum != 0){
                z -= (y<<4 ^ y>>>5)+y ^ sum+k[sum>>>11 & 3];
                sum -= delta;
                y -= (z<<4 ^ z>>>5)+z ^ sum+k[sum & 3];}
            v[0] = y; v[1] = z;}

    }
}
