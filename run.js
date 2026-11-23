const fs = require('fs');
const crypto = require('crypto');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const BASE91_STANDARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"{•}{√}{π}{÷}∆§×{=°}][][][][][]{]][[{][}]';
const HASH_PLACEHOLDER = '__INTEGRITY_HASH_SLOT_9981__';

function shuffleAlphabet(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

function encodeBase91(text, alphabet) {
  const data = Buffer.from(text, 'utf8');
  let b = 0;
  let n = 0;
  let out = '';

  for (let i = 0; i < data.length; i++) {
    b |= data[i] << n;
    n += 8;
    if (n > 13) {
      let v = b & 8191;
      if (v > 88) {
        b >>= 13;
        n -= 13;
      } else {
        v = b & 16383;
        b >>= 14;
        n -= 14;
      }
      out += alphabet[v % 91] + alphabet[Math.floor(v / 91)];
    }
  }

  if (n > 0) {
    out += alphabet[b % 91];
    if (n > 7 || b > 90) {
      out += alphabet[Math.floor(b / 91)];
    }
  }
  return out;
}

function genHexName() {
  return '_0x' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function buildGuardCode(licenseConfig) {
  const info = {
    owner: licenseConfig.owner || 'RyotaXD',
    product: licenseConfig.product || 'Protected Script',
    contact: licenseConfig.contact || 'https://github.com/RyotaXD',
    year: licenseConfig.year || new Date().getFullYear()
  };

  return `
    (function() {
      const _fs = require('fs');
      const _crypto = require('crypto');
      const _expectedHash = "${HASH_PLACEHOLDER}";
      const _origErrWrite = process.stderr.write.bind(process.stderr);

      function _triggerLicenseViolation(reason) {
        const banner = [
          '\\n============================================================',
          '  [!] SECURITY & LICENSE VIOLATION DETECTED [!]',
          '============================================================',
          '  Tools     : ${info.product}',
          '  Author    : ${info.owner} (c) ${info.year}',
          '  Contact   : ${info.contact}',
          '  Status    : Unauthorized Modification / Dumping Blocked',
          '  Reason    : ' + reason,
          '------------------------------------------------------------',
          '  This software is protected by intellectual property laws.',
          '  Reverse engineering, deobfuscation, and code dumping are',
          '  strictly prohibited without written permission.',
          '============================================================\\n'
        ].join('\\n');

        try {
          _origErrWrite(banner);
        } catch (e) {
          console.error(banner);
        }
        process.exit(1);
      }

      const _suspiciousFlags = [
        '--inspect',
        '--inspect-brk',
        '--inspect-port',
        '--inspect-publish-uid',
        '--debug',
        '--debug-brk',
        '--debug-port',
        '-r',
        '--require',
        '--import',
        '--loader',
        '--experimental-loader',
        '--print-bytecode',
        '--print-opt-code',
        '--print-code',
        '--print-ast',
        '--print-scopes',
        '--trace-opt',
        '--trace-deopt',
        '--trace-ic',
        '--log-all',
        '--log-code',
        '--disallow-code-generation-from-strings',
        '--heapsnapshot-signal',
        '--prof'
      ];

      const _argsList = (process.execArgv || []).concat(process.argv || []);
      const _nodeOpts = (process.env.NODE_OPTIONS || '').split(/\\s+/);
      const _allTokens = _argsList.concat(_nodeOpts);

      for (let i = 0; i < _allTokens.length; i++) {
        const token = _allTokens[i];
        if (!token) continue;
        for (let j = 0; j < _suspiciousFlags.length; j++) {
          const flag = _suspiciousFlags[j];
          if (token === flag || (flag.length > 2 && token.startsWith(flag + '='))) {
            _triggerLicenseViolation('Suspicious Runtime Flag (' + token + ')');
          }
        }
      }

      const _suspiciousEnvKeys = ['NODE_DEBUG', 'NODE_DEBUG_NATIVE', 'UV_THREADPOOL_SIZE_HOOK'];
      for (let i = 0; i < _suspiciousEnvKeys.length; i++) {
        if (process.env[_suspiciousEnvKeys[i]]) {
          _triggerLicenseViolation('Suspicious Environment Variable (' + _suspiciousEnvKeys[i] + ')');
        }
      }

      const _nativeFns = [
        { name: 'Function.toString', fn: Function.prototype.toString },
        { name: 'eval', fn: eval }
      ];

      for (let i = 0; i < _nativeFns.length; i++) {
        const str = Function.prototype.toString.call(_nativeFns[i].fn);
        if (str.indexOf('[native code]') === -1) {
          _triggerLicenseViolation('Native Function Hooked (' + _nativeFns[i].name + ')');
        }
      }

      if (typeof _fs.readFileSync !== 'function' || typeof _crypto.createHash !== 'function') {
        _triggerLicenseViolation('Core Module Tampered (fs/crypto)');
      }

      const _t0 = performance.now();
      (function() {}).constructor('debugger');
      const _t1 = performance.now();
      if (_t1 - _t0 > 200) {
        _triggerLicenseViolation('Execution Time Anomaly / Breakpoint Detected');
      }

      function _verifyIntegrity() {
        try {
          if (typeof __filename === 'undefined') return;
          const _rawContent = _fs.readFileSync(__filename, 'utf8');
          const _slotMarker = "__INTEGRITY_HASH_" + "SLOT_9981__";
          const _normalized = _rawContent.split(_expectedHash).join(_slotMarker);
          const _currentHash = _crypto.createHash('sha256').update(_normalized).digest('hex');

          if (_currentHash !== _expectedHash) {
            _triggerLicenseViolation('File Checksum Mismatch (Code Beautified or Modified)');
          }
        } catch (err) {
          _triggerLicenseViolation('Integrity Verification Error');
        }
      }

      _verifyIntegrity();
      const _interval = setInterval(_verifyIntegrity, 4000);
      if (_interval.unref) _interval.unref();

      try {
        Object.defineProperty(Function.prototype, 'toString', {
          writable: false,
          configurable: false
        });
      } catch (e) {}
    })();
  `;
}

function obfuscateWithProtection(sourceCode, licenseConfig = {}) {
  const fullSource = buildGuardCode(licenseConfig) + '\n' + sourceCode;

  const ast = parser.parse(fullSource, {
    sourceType: 'unambiguous',
    allowReturnOutsideFunction: true
  });

  const DECODER_COUNT = 3;
  const decoders = [];
  for (let i = 0; i < DECODER_COUNT; i++) {
    decoders.push({
      fnName: genHexName(),
      sliceFnName: genHexName(),
      alphabet: shuffleAlphabet(BASE91_STANDARD)
    });
  }

  const constArrayName = genHexName();
  const bigStringVarName = genHexName();
  const utf8HelperName = genHexName();
  let bigStringPool = '';

  const constPool = [0, 1, 8, 255, 'length', 63, 6, 'fromCodePoint', 7, 12, 'push', 'undefined', 91, 8191, 88, 13, 14, 'slice', 15];

  function addStringToPool(str) {
    const decoder = decoders[Math.floor(Math.random() * decoders.length)];
    const encoded = encodeBase91(str, decoder.alphabet);
    const offset = bigStringPool.length;
    bigStringPool += encoded;
    return {
      sliceFn: decoder.sliceFnName,
      offset,
      length: encoded.length
    };
  }

  traverse(ast, {
    StringLiteral(path) {
      if (path.parent.type === 'DirectiveLiteral') return;
      if (path.node.value === HASH_PLACEHOLDER) return;

      if (path.parent.type === 'ObjectProperty' && path.parentKey === 'key' && !path.parent.computed) {
        path.parent.computed = true;
      }

      const { sliceFn, offset, length } = addStringToPool(path.node.value);
      path.replaceWith(
        t.callExpression(t.identifier(sliceFn), [
          t.numericLiteral(offset),
          t.numericLiteral(length)
        ])
      );
    },
    MemberExpression(path) {
      if (!path.node.computed && t.isIdentifier(path.node.property)) {
        const propName = path.node.property.name;
        const { sliceFn, offset, length } = addStringToPool(propName);
        path.node.computed = true;
        path.node.property = t.callExpression(t.identifier(sliceFn), [
          t.numericLiteral(offset),
          t.numericLiteral(length)
        ]);
      }
    }
  });

  const transformedBody = generate(ast, { compact: true }).code;

  const decoderFunctionsCode = decoders.map(d => {
    const paramArg = genHexName();
    const alphaVar = genHexName();
    const strVar = genHexName();
    const lenVar = genHexName();
    const outArr = genHexName();
    const bVar = genHexName();
    const nVar = genHexName();
    const vVar = genHexName();
    const idxVar = genHexName();
    const charIdx = genHexName();

    return `
      function ${d.fnName}(${paramArg}) {
        var ${alphaVar} = '${d.alphabet.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';
        var ${strVar} = "" + (${paramArg} || "");
        var ${lenVar} = ${strVar}.length;
        var ${outArr} = [];
        var ${bVar} = ${constArrayName}[0];
        var ${nVar} = ${constArrayName}[0];
        var ${vVar} = -${constArrayName}[1];
        for (var ${idxVar} = ${constArrayName}[0]; ${idxVar} < ${lenVar}; ${idxVar}++) {
          var ${charIdx} = ${alphaVar}.indexOf(${strVar}[${idxVar}]);
          if (${charIdx} === -${constArrayName}[1]) continue;
          if (${vVar} < ${constArrayName}[0]) {
            ${vVar} = ${charIdx};
          } else {
            ${vVar} += ${charIdx} * ${constArrayName}[12];
            ${bVar} |= ${vVar} << ${nVar};
            ${nVar} += (${vVar} & ${constArrayName}[13]) > ${constArrayName}[14] ? ${constArrayName}[15] : ${constArrayName}[16];
            do {
              ${outArr}.push(${bVar} & ${constArrayName}[3]);
              ${bVar} >>= ${constArrayName}[2];
              ${nVar} -= ${constArrayName}[2];
            } while (${nVar} > ${constArrayName}[8]);
            ${vVar} = -${constArrayName}[1];
          }
        }
        if (${vVar} > -${constArrayName}[1]) {
          ${outArr}.push((${bVar} | ${vVar} << ${nVar}) & ${constArrayName}[3]);
        }
        return ${utf8HelperName}(${outArr});
      }
      function ${d.sliceFnName}(a, b) {
        return ${d.fnName}(${bigStringVarName}[${constArrayName}[17]](a, a + b));
      }
    `;
  }).join('\n');

  const runtimeHeader = `
    (function() {
      const ${constArrayName} = ${JSON.stringify(constPool)};
      function ${utf8HelperName}(bytes) {
        if (typeof TextDecoder !== ${constArrayName}[11]) {
          return new TextDecoder().decode(new Uint8Array(bytes));
        } else if (typeof Buffer !== ${constArrayName}[11]) {
          return Buffer.from(bytes).toString("utf-8");
        }
        return String.fromCharCode.apply(null, bytes);
      }
      var ${bigStringVarName} = '${bigStringPool.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';
      ${decoderFunctionsCode}
      ${transformedBody}
    })();
  `;

  const finalAst = parser.parse(runtimeHeader);
  const minifiedCode = generate(finalAst, { compact: true, comments: false }).code;

  const finalHash = crypto.createHash('sha256').update(minifiedCode).digest('hex');
  return minifiedCode.split(HASH_PLACEHOLDER).join(finalHash);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || '_obf.js';

if (!inputFile) {
  console.log('Usage: node obfuscator.js <input.js> [output.js]');
  process.exit(1);
}

const rawCode = fs.readFileSync(inputFile, 'utf8');
const protectedCode = obfuscateWithProtection(rawCode, {
  owner: 'RyotaXD',
  product: 'NodeJS Obfuscate',
  contact: 'https://github.com/RyotaXD',
  year: '2026'
});

fs.writeFileSync(outputFile, protectedCode, 'utf8');
console.log(`[+] Sukses! File terproteksi tersimpan di: ${outputFile}`);
