export default {
  data: () => {
    return {
      baseKey: null,
      keyStr:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      pcount: '',
    };
  },
  created() {
    if (localStorage.getItem('labelPage') !== null) {
      this.baseKey = this.getKeyOriginal(
        JSON.parse(localStorage.getItem('labelPage'))
      );
    }
  },
  mounted() {
    if (this.baseKey === null)
      this.rndStr(4).then((str) => {
        this.baseKey = str;
      });
  },
  methods: {
    getKeyOriginal(baseKey) {
      let key = '';

      for (const [i, char] of baseKey.entries())
        key += String.fromCharCode((char - 81) / (9 - i));

      return key;
    },
    rndStr(len) {
      return new Promise((resolved, reject) => {
        let text = '';
        const chars = 'bnopqrstcdefghavwxyzijklmu';

        for (let i = 0; i < len; i++) {
          text += chars.charAt(Math.floor(Math.random() * chars.length));
          if (i == len - 1) resolved(text);
        }
      });
    },
    encrypt(strEncrypt) {
      const vm = this;
      const v = new Array(2);
      const k = new Array(4);
      let s = '';
      var i = '';
      const plaintext = vm.escCtrlCh(strEncrypt);
      const password = this.baseKey;
      for (var i = 0; i < 4; i++)
        k[i] = vm.Str4ToLong(password.slice(i * 4, (i + 1) * 4));
      for (i = 0; i < plaintext.length; i += 8) {
        v[0] = vm.Str4ToLong(plaintext.slice(i, i + 4));
        v[1] = vm.Str4ToLong(plaintext.slice(i + 4, i + 8));
        vm.code(v, k);
        s += vm.LongToStr4(v[0]) + vm.LongToStr4(v[1]);
      }
      const input = vm.escCtrlCh(s);
      let output = '';
      let chr1, chr2, chr3;
      let enc1, enc2, enc3, enc4;
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
      // this.decrypt(output);
    },
    decrypt(strDesEncrypt) {
      const vm = this;
      let input = strDesEncrypt;
      let output = '';
      let chr1, chr2, chr3;
      let enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (i < input.length) {
        enc1 = vm.keyStr.indexOf(input.charAt(i++));
        enc2 = vm.keyStr.indexOf(input.charAt(i++));
        enc3 = vm.keyStr.indexOf(input.charAt(i++));
        enc4 = vm.keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output += String.fromCharCode(chr1);
        if (enc3 != 64) {
          output += String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output += String.fromCharCode(chr3);
        }
      }
      output = output.toString();
      const v = new Array(2);
      const k = new Array(4);
      let s = '';
      var i = '';
      const ciphertext = vm.unescCtrlCh(output);
      const password = this.baseKey;

      for (var i = 0; i < 4; i++)
        k[i] = vm.Str4ToLong(password.slice(i * 4, (i + 1) * 4));
      for (i = 0; i < ciphertext.length; i += 8) {
        v[0] = vm.Str4ToLong(ciphertext.slice(i, i + 4));
        v[1] = vm.Str4ToLong(ciphertext.slice(i + 4, i + 8));
        vm.decode(v, k);
        s += vm.LongToStr4(v[0]) + vm.LongToStr4(v[1]);
      }
      s = s.replace(/\0+$/, '');
      return vm.unescCtrlCh(s);
    },
    Str4ToLong(s) {
      let v = 0;
      for (let i = 0; i < 4; i++) v |= s.charCodeAt(i) << (i * 8);
      return isNaN(v) ? 0 : v;
    },

    LongToStr4(v) {
      const s = String.fromCharCode(
        v & 0xff,
        (v >> 8) & 0xff,
        (v >> 16) & 0xff,
        (v >> 24) & 0xff
      );
      return s;
    },

    escCtrlCh(str) {
      return str.replace(/[\0\t\n\v\f\r\xa0'"!]/g, (c) => {
        return `!${c.charCodeAt(0)}!`;
      });
    },

    unescCtrlCh(str) {
      return str.replace(/!\d\d?\d?!/g, (c) => {
        return String.fromCharCode(c.slice(1, -1));
      });
    },
    code(v, k) {
      let y = v[0];
      let z = v[1];
      const delta = 0x9e9779b3;
      const limit = delta * 32;
      let sum = 0;
      while (sum != limit) {
        y += (((z << 4) ^ (z >>> 5)) + z) ^ (sum + k[sum & 3]);
        sum += delta;
        z += (((y << 4) ^ (y >>> 5)) + y) ^ (sum + k[(sum >>> 11) & 3]);
      }
      v[0] = y;
      v[1] = z;
    },
    decode(v, k) {
      let y = v[0];
      let z = v[1];
      const delta = 0x9e9779b3;
      let sum = delta * 32;
      while (sum != 0) {
        z -= (((y << 4) ^ (y >>> 5)) + y) ^ (sum + k[(sum >>> 11) & 3]);
        sum -= delta;
        y -= (((z << 4) ^ (z >>> 5)) + z) ^ (sum + k[sum & 3]);
      }
      v[0] = y;
      v[1] = z;
    },
  },
};
