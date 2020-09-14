const COMPUTE = {
  upload: {
    'Intel:arc32:arduino_101': {
      'darwin:amd64': {
        commandline: '"{runtime.tools.arduino101load.path}/arduino101load" "-dfu={runtime.tools.dfu-util.path}" "-bin={build.path}/{build.project_name}.bin" -port={serial.port} "-v" -ble_fw_str="ATP1BLE00R-1631C4439" -ble_fw_pos=169984 -rtos_fw_str="" -rtos_fw_pos=0 -core=2.0.0',
        options: { use_1200bps_touch: true, wait_for_upload_port: false },
        signature: '57c4dcf92201ad994352183b5e6ead84a39951f1b8a79259eef16955093ede3aa7d224b8cdd1f677b1368d9eccbf9b9514d0862aa1d437cf61f40b3492a73caf3e5d07287a62b3a59f6de1bd187025bfff95d0eb84b3182d71115d53fda1d5b0f9ec0ed05cdfec2af9d07b5d842b203c4534bdde71893f4d64c9f96dac5048f565638018caab307f206614e9da8f90454fffbcc6f4e2a2f094d3e231433f66123eadebfe3f3973ebb42ed0a20d5bb743c22e30ff21131f653dfe1d920cd9666e2e7d076041a96fafad1f9ce71ea632b51b1b168dffcca44a673a360577ccb2618b93c10760e2da0781b7f94e9be70479b4c20ef45d8637b61660a1fb704efc18',
        tools: [{
          checksum: 'SHA-256:ea9216c627b7aa2d3a9bffab97df937e3c580cce66753c428dc697c854a35271', name: 'dfu-util', packager: 'arduino', signature: '229d5ea6eeb7dbbf85183ce6522e79aa23623f3e48d61441306661390ffb10390156cd356c9a20f6dddb434e74a50e9dd430cdefbf86a695e42b5f09efa12b8855e841b6357129cc907f733d2d0995a706bfb9791312eefc980d8eb982856168ca7f198bb795ba2f0cc72ea31b51edb7c4174281992339ecd0c27dee0e9ccc171ab71f16a32eaf93b3b76f66e3475578540aaa9ab49676b90a58e8ff58dd5a2a1be90813cec2d6cc3b1cbd4c194708345bf3f19cec56ff1fa7d4ecf30f816f55489ee0918f52e4f92fe338c2bf9d9e38d6c2ef2e7ddd930f606fb54aba0d8fbe7102d72acab451e16f6196afc3f808f0a4a14fe4b261a1184884fb0853536d50', url: 'http://downloads.arduino.cc/tools/dfu-util-0.9.0-arduino1-osx.tar.bz2', version: '0.9.0-arduino1',
        }, {
          checksum: 'SHA-256:1f96480028a2aaa9475a1f44c5912236b6a039fced948fe2042a0353c88c1fb0', name: 'arduino101load', packager: 'Intel', signature: '136ddf9fdd88dbfb410904cf910acdd087e821094325c716f69e9b233b84e989864fcb41210e332e5ce8d1a53bca3338cc083c37d8790eff931b60f63fbda041cbf3e71171854bbb521121f0d1c34a329ceefca6728067559e37161c6bcc9aa06eae5e0202d16ed5e4c7ac02dba250a6bb638a96a77b6a93d0022a119f261ed1f555c817bb5eec3bcd0400a59e4fe986b2fcc671924da6d33baa397ebca9fe73dd6897105fc5672722716af07b3f0db8b165c670ff338585ac7ac18de7b55e57a450788fb84b5bc3990d1128dc805cf430dd1ea9864e7a18a2c834fdb7f51e43e3351838374eb33501b27bb26242aa4e8650406f99e5e5187650497029324d67', url: 'http://downloads.arduino.cc/tools/arduino101load-2.0.1-darwin_amd64.tar.bz2', version: '2.0.1',
        }],
      },
      'windows:386': {
        commandline: '"{runtime.tools.arduino101load.path}/arduino101load" "-dfu={runtime.tools.dfu-util.path}" "-bin={build.path}/{build.project_name}.bin" -port={serial.port} "-v" -ble_fw_str="ATP1BLE00R-1631C4439" -ble_fw_pos=169984 -rtos_fw_str="" -rtos_fw_pos=0 -core=2.0.0',
        options: { use_1200bps_touch: true, wait_for_upload_port: false },
        signature: '57c4dcf92201ad994352183b5e6ead84a39951f1b8a79259eef16955093ede3aa7d224b8cdd1f677b1368d9eccbf9b9514d0862aa1d437cf61f40b3492a73caf3e5d07287a62b3a59f6de1bd187025bfff95d0eb84b3182d71115d53fda1d5b0f9ec0ed05cdfec2af9d07b5d842b203c4534bdde71893f4d64c9f96dac5048f565638018caab307f206614e9da8f90454fffbcc6f4e2a2f094d3e231433f66123eadebfe3f3973ebb42ed0a20d5bb743c22e30ff21131f653dfe1d920cd9666e2e7d076041a96fafad1f9ce71ea632b51b1b168dffcca44a673a360577ccb2618b93c10760e2da0781b7f94e9be70479b4c20ef45d8637b61660a1fb704efc18',
        tools: [{
          checksum: 'SHA-256:29be01b298348be8b822391be7147b71a969d47bd5457d5b24cfa5981dbce78e', name: 'dfu-util', packager: 'arduino', signature: '9832fea00cf1e3e5d1f4e5e8575e923725e4685b1c5f01697547eb043b3615b46a26ada9b7df73fa14cf1b45832352ad94979fa994d352a96ff66a3918b13a4121c77ff7543c0584c3359491199dfb60e038f95fbbc935cf1edabb58147c921b933fc7715915d83c5c05d9d38a2379638c27daba6a7e32989e53956444aefa5594753e26a74ecc251de8e93e601ca108c5ec878bc6081dc506be1be3d9ccfd189a715ebcef1b2fbd2dbf3767719e7fcccac1798e22b3211917561ff05edde751b13e3399bbe050b870f7ad081906f5f1863ddea17272dc71825395da8593e3e371578e09ab3a8cb7ba623143fc10e70c1b4934a274c84f0e293d4ea022de1143', url: 'http://downloads.arduino.cc/tools/dfu-util-0.9.0-arduino1-windows.tar.bz2', version: '0.9.0-arduino1',
        }, {
          checksum: 'SHA-256:932373b6da9a8ad8ee9051937ea42cedde604fa8437050dcf7baa29564fc4547', name: 'arduino101load', packager: 'Intel', signature: '794ccbb3e9322641fd3b4d9832342f1a5db4b3b6d3b4c48d2e5760d68b006af803d71234a3d5a9c30cfb875a7d340a10c456d1184d7a3efd95ddb5abcfde0545c5204a5170eaa40254528aee342e696ab5a520a3ec598ad7227f84a4151fcdb738cdd815b272962b1ed072592b43efec771455d9bdbe27ee6dd63fa3ec7179efe865eaa9d128c0abcc6c0e5ae65d0e412487fa4967bc038bee11d67aca023964caa135cac4d19c43c36ebe3ce95a10a484f68f9796bf5b3ea047c04a7ac763a6ca064d1c3ce8a7d92121019c2821cc4c6ad713859e61eb9993f3763bace59637ad5373bb8f4047bcefd29966cf69fad41a8c9e1cb22426429b2db77900c6bfff', url: 'http://downloads.arduino.cc/tools/arduino101load-2.0.1-windows_386.tar.bz2', version: '2.0.1',
        }],
      },
    },
    'arduino:avr:uno': {
      'darwin:amd64': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega328p -carduino "-P{serial.port}" -b115200 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: { use_1200bps_touch: false, wait_for_upload_port: false },
        signature: '06d861706dc3a9cad3824cd7c374568eb5d7f55c057bdb72726e0846575b6dc61d0c07e0628f0e51d7828307fefdfce702d8253dde90d67a554f8a795fa2c994469b10971fa2f198956493778fedf9fa4941dc6d9fa07648b477bb6cd27e2a82ea027171036fce1bc87745584a3377a055cedc09486e25de9e005415c4aa38f73b840dac6769ea82fbce2e39ba903b01738ec7cdf4688a255fcf80dfe5cd91cc7c6764133cdd5761be5f7bed3f59a888614aded15c347eceab5d169671bfba10fc0f7a5db07c504271917bdb3075c7b213a3facb915e48dd74077d88c59b94e0ebbff126994831c634f31d3a2d7edc754524b77aabde296a7ca3be13d86ff19a',
        tools: [{
          checksum: 'SHA-256:47d03991522722ce92120c60c4118685b7861909d895f34575001137961e4a63', name: 'avrdude', packager: 'arduino', signature: '2e097f9a3fdfbaae2dc130433ece784cc60fb5af884b56297d7c3f3c5d3a6aa0b0d74eb3cdcb8c91713c2c02da18031aed951b58534935788072beccc03d8d6b4ad704e3a8b55ae4635ce44f5fa20d965bc0a8b24991821d3d48314ac06603dde23d95b8f9b17e0efa6c12657dd47ce168df85c88b01d2655a3eada2869902c81b9054749ac50bba8ec97976d3c5d37e835891d9dc0135b67605834ddb41a1fbe06161a6e3d62e166ec78ead735e0bce403f3567d0ad4d0211211b9f07437ee464cdf4d43cb31bf7e7aff0a5bd317ad8b4582505c6c891952f65567d6701538e65cf932840e9f1dca1c94c09634406cdd23887d4bd51e034bdb094d8d552f037', url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i386-apple-darwin11.tar.bz2', version: '6.3.0-arduino14',
        }],
      },
      'windows:386': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega328p -carduino "-P{serial.port}" -b115200 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: { use_1200bps_touch: false, wait_for_upload_port: false },
        signature: '06d861706dc3a9cad3824cd7c374568eb5d7f55c057bdb72726e0846575b6dc61d0c07e0628f0e51d7828307fefdfce702d8253dde90d67a554f8a795fa2c994469b10971fa2f198956493778fedf9fa4941dc6d9fa07648b477bb6cd27e2a82ea027171036fce1bc87745584a3377a055cedc09486e25de9e005415c4aa38f73b840dac6769ea82fbce2e39ba903b01738ec7cdf4688a255fcf80dfe5cd91cc7c6764133cdd5761be5f7bed3f59a888614aded15c347eceab5d169671bfba10fc0f7a5db07c504271917bdb3075c7b213a3facb915e48dd74077d88c59b94e0ebbff126994831c634f31d3a2d7edc754524b77aabde296a7ca3be13d86ff19a',
        tools: [{
          checksum: 'SHA-256:69293e0de2eff8de89f553477795c25005f674a320bbba4b0222beb0194aa297', name: 'avrdude', packager: 'arduino', signature: '45c81d05ef0b7f30b82d551d6520ef30d34039c1f462a29481f5edf42c1f9dfddb8f6b7022cce36f89cc13bb170dab1c5e0f98152871ec7750423d43bebb9bdfab8eb6e2d9e7a071d1d957437b4b0f37183c5e52ae81d79305d604037f54ea041444160594b912b713fcc52c823e16fc9bbf8dc3afde1eb7c59be4380a4bea066a01308859bd0963987bacb37197588120f3cf3c97441d2332bf2d3575ea74a31678755f2022a1afc881c91d69fb1b74dfd26c9feeb7578ab98721e7b5cd4b5ec090aa5fa4aeaad833a9446066295c13e5ea7b2031a9e8d3666a312c06f6eecce00d82287de0074267ee3bf4de4fa5d88d450487c3de05fded50d9822458dcba', url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i686-w64-mingw32.zip', version: '6.3.0-arduino14',
        }],
      },
    },
    'arduino:avr:leonardo': {
      'darwin:amd64': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega32u4 -cavr109 "-P{serial.port}" -b57600 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: {
          use_1200bps_touch: true,
          wait_for_upload_port: true,
        },
        signature: 'a27f78c607f92e1c168ef755f28172c984c90882697a95010b93cf8487fe959c2f316015b78a47ada68aadd5214721281bdae62e4b735aefbf6178647e0f3e6a31c6e59c4940c2c25cd7c1dcd4c3c331df2d5a33f7e7ef5a35332b0dcd973f5fc008b5d3f78350bbd75d3e1c4110e3afa602817898959eedc357414c02a2668b1970386f84d689d184bd7098842b242d9f76b2251ea487a26b39891ab7a58ea0046a19a57dc303d671233f54a7122535b556be889cf2dc9ea00cab2132948d71aee6823fd0648ac496f493e01f5df14522e25fa5984e79e17771588018801f4eec7e991b97e8e013668d0f0da275e11cbe34893b067edd2c3eb9edd22f157943',
        tools: [
          {
            checksum: 'SHA-256:47d03991522722ce92120c60c4118685b7861909d895f34575001137961e4a63',
            name: 'avrdude',
            packager: 'arduino',
            signature: '2e097f9a3fdfbaae2dc130433ece784cc60fb5af884b56297d7c3f3c5d3a6aa0b0d74eb3cdcb8c91713c2c02da18031aed951b58534935788072beccc03d8d6b4ad704e3a8b55ae4635ce44f5fa20d965bc0a8b24991821d3d48314ac06603dde23d95b8f9b17e0efa6c12657dd47ce168df85c88b01d2655a3eada2869902c81b9054749ac50bba8ec97976d3c5d37e835891d9dc0135b67605834ddb41a1fbe06161a6e3d62e166ec78ead735e0bce403f3567d0ad4d0211211b9f07437ee464cdf4d43cb31bf7e7aff0a5bd317ad8b4582505c6c891952f65567d6701538e65cf932840e9f1dca1c94c09634406cdd23887d4bd51e034bdb094d8d552f037',
            url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i386-apple-darwin11.tar.bz2',
            version: '6.3.0-arduino14',
          },
        ],
      },
      'windows:386': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega32u4 -cavr109 "-P{serial.port}" -b57600 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: { use_1200bps_touch: true, wait_for_upload_port: true },
        signature: 'a27f78c607f92e1c168ef755f28172c984c90882697a95010b93cf8487fe959c2f316015b78a47ada68aadd5214721281bdae62e4b735aefbf6178647e0f3e6a31c6e59c4940c2c25cd7c1dcd4c3c331df2d5a33f7e7ef5a35332b0dcd973f5fc008b5d3f78350bbd75d3e1c4110e3afa602817898959eedc357414c02a2668b1970386f84d689d184bd7098842b242d9f76b2251ea487a26b39891ab7a58ea0046a19a57dc303d671233f54a7122535b556be889cf2dc9ea00cab2132948d71aee6823fd0648ac496f493e01f5df14522e25fa5984e79e17771588018801f4eec7e991b97e8e013668d0f0da275e11cbe34893b067edd2c3eb9edd22f157943',
        tools: [{
          checksum: 'SHA-256:69293e0de2eff8de89f553477795c25005f674a320bbba4b0222beb0194aa297', name: 'avrdude', packager: 'arduino', signature: '45c81d05ef0b7f30b82d551d6520ef30d34039c1f462a29481f5edf42c1f9dfddb8f6b7022cce36f89cc13bb170dab1c5e0f98152871ec7750423d43bebb9bdfab8eb6e2d9e7a071d1d957437b4b0f37183c5e52ae81d79305d604037f54ea041444160594b912b713fcc52c823e16fc9bbf8dc3afde1eb7c59be4380a4bea066a01308859bd0963987bacb37197588120f3cf3c97441d2332bf2d3575ea74a31678755f2022a1afc881c91d69fb1b74dfd26c9feeb7578ab98721e7b5cd4b5ec090aa5fa4aeaad833a9446066295c13e5ea7b2031a9e8d3666a312c06f6eecce00d82287de0074267ee3bf4de4fa5d88d450487c3de05fded50d9822458dcba', url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i686-w64-mingw32.zip', version: '6.3.0-arduino14',
        }],
      },
    },
    'arduino:avr:micro': {
      'darwin:amd64': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega32u4 -cavr109 "-P{serial.port}" -b57600 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: { use_1200bps_touch: true, wait_for_upload_port: true },
        signature: 'a27f78c607f92e1c168ef755f28172c984c90882697a95010b93cf8487fe959c2f316015b78a47ada68aadd5214721281bdae62e4b735aefbf6178647e0f3e6a31c6e59c4940c2c25cd7c1dcd4c3c331df2d5a33f7e7ef5a35332b0dcd973f5fc008b5d3f78350bbd75d3e1c4110e3afa602817898959eedc357414c02a2668b1970386f84d689d184bd7098842b242d9f76b2251ea487a26b39891ab7a58ea0046a19a57dc303d671233f54a7122535b556be889cf2dc9ea00cab2132948d71aee6823fd0648ac496f493e01f5df14522e25fa5984e79e17771588018801f4eec7e991b97e8e013668d0f0da275e11cbe34893b067edd2c3eb9edd22f157943',
        tools: [{
          checksum: 'SHA-256:47d03991522722ce92120c60c4118685b7861909d895f34575001137961e4a63', name: 'avrdude', packager: 'arduino', signature: '2e097f9a3fdfbaae2dc130433ece784cc60fb5af884b56297d7c3f3c5d3a6aa0b0d74eb3cdcb8c91713c2c02da18031aed951b58534935788072beccc03d8d6b4ad704e3a8b55ae4635ce44f5fa20d965bc0a8b24991821d3d48314ac06603dde23d95b8f9b17e0efa6c12657dd47ce168df85c88b01d2655a3eada2869902c81b9054749ac50bba8ec97976d3c5d37e835891d9dc0135b67605834ddb41a1fbe06161a6e3d62e166ec78ead735e0bce403f3567d0ad4d0211211b9f07437ee464cdf4d43cb31bf7e7aff0a5bd317ad8b4582505c6c891952f65567d6701538e65cf932840e9f1dca1c94c09634406cdd23887d4bd51e034bdb094d8d552f037', url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i386-apple-darwin11.tar.bz2', version: '6.3.0-arduino14',
        }],
      },
      'windows:386': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega32u4 -cavr109 "-P{serial.port}" -b57600 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: {
          use_1200bps_touch: true,
          wait_for_upload_port: true,
        },
        signature: 'a27f78c607f92e1c168ef755f28172c984c90882697a95010b93cf8487fe959c2f316015b78a47ada68aadd5214721281bdae62e4b735aefbf6178647e0f3e6a31c6e59c4940c2c25cd7c1dcd4c3c331df2d5a33f7e7ef5a35332b0dcd973f5fc008b5d3f78350bbd75d3e1c4110e3afa602817898959eedc357414c02a2668b1970386f84d689d184bd7098842b242d9f76b2251ea487a26b39891ab7a58ea0046a19a57dc303d671233f54a7122535b556be889cf2dc9ea00cab2132948d71aee6823fd0648ac496f493e01f5df14522e25fa5984e79e17771588018801f4eec7e991b97e8e013668d0f0da275e11cbe34893b067edd2c3eb9edd22f157943',
        tools: [
          {
            checksum: 'SHA-256:69293e0de2eff8de89f553477795c25005f674a320bbba4b0222beb0194aa297',
            name: 'avrdude',
            packager: 'arduino',
            signature: '45c81d05ef0b7f30b82d551d6520ef30d34039c1f462a29481f5edf42c1f9dfddb8f6b7022cce36f89cc13bb170dab1c5e0f98152871ec7750423d43bebb9bdfab8eb6e2d9e7a071d1d957437b4b0f37183c5e52ae81d79305d604037f54ea041444160594b912b713fcc52c823e16fc9bbf8dc3afde1eb7c59be4380a4bea066a01308859bd0963987bacb37197588120f3cf3c97441d2332bf2d3575ea74a31678755f2022a1afc881c91d69fb1b74dfd26c9feeb7578ab98721e7b5cd4b5ec090aa5fa4aeaad833a9446066295c13e5ea7b2031a9e8d3666a312c06f6eecce00d82287de0074267ee3bf4de4fa5d88d450487c3de05fded50d9822458dcba',
            url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i686-w64-mingw32.zip',
            version: '6.3.0-arduino14',
          },
        ],
      },
    },
    'arduino:avr:nano': {
      'darwin:amd64': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega328p -carduino "-P{serial.port}" -b115200 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: { use_1200bps_touch: false, wait_for_upload_port: false },
        signature: '06d861706dc3a9cad3824cd7c374568eb5d7f55c057bdb72726e0846575b6dc61d0c07e0628f0e51d7828307fefdfce702d8253dde90d67a554f8a795fa2c994469b10971fa2f198956493778fedf9fa4941dc6d9fa07648b477bb6cd27e2a82ea027171036fce1bc87745584a3377a055cedc09486e25de9e005415c4aa38f73b840dac6769ea82fbce2e39ba903b01738ec7cdf4688a255fcf80dfe5cd91cc7c6764133cdd5761be5f7bed3f59a888614aded15c347eceab5d169671bfba10fc0f7a5db07c504271917bdb3075c7b213a3facb915e48dd74077d88c59b94e0ebbff126994831c634f31d3a2d7edc754524b77aabde296a7ca3be13d86ff19a',
        tools: [{
          checksum: 'SHA-256:47d03991522722ce92120c60c4118685b7861909d895f34575001137961e4a63', name: 'avrdude', packager: 'arduino', signature: '2e097f9a3fdfbaae2dc130433ece784cc60fb5af884b56297d7c3f3c5d3a6aa0b0d74eb3cdcb8c91713c2c02da18031aed951b58534935788072beccc03d8d6b4ad704e3a8b55ae4635ce44f5fa20d965bc0a8b24991821d3d48314ac06603dde23d95b8f9b17e0efa6c12657dd47ce168df85c88b01d2655a3eada2869902c81b9054749ac50bba8ec97976d3c5d37e835891d9dc0135b67605834ddb41a1fbe06161a6e3d62e166ec78ead735e0bce403f3567d0ad4d0211211b9f07437ee464cdf4d43cb31bf7e7aff0a5bd317ad8b4582505c6c891952f65567d6701538e65cf932840e9f1dca1c94c09634406cdd23887d4bd51e034bdb094d8d552f037', url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i386-apple-darwin11.tar.bz2', version: '6.3.0-arduino14',
        }],
      },
      'windows:386': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega328p -carduino "-P{serial.port}" -b115200 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: {
          use_1200bps_touch: false,
          wait_for_upload_port: false,
        },
        signature: '06d861706dc3a9cad3824cd7c374568eb5d7f55c057bdb72726e0846575b6dc61d0c07e0628f0e51d7828307fefdfce702d8253dde90d67a554f8a795fa2c994469b10971fa2f198956493778fedf9fa4941dc6d9fa07648b477bb6cd27e2a82ea027171036fce1bc87745584a3377a055cedc09486e25de9e005415c4aa38f73b840dac6769ea82fbce2e39ba903b01738ec7cdf4688a255fcf80dfe5cd91cc7c6764133cdd5761be5f7bed3f59a888614aded15c347eceab5d169671bfba10fc0f7a5db07c504271917bdb3075c7b213a3facb915e48dd74077d88c59b94e0ebbff126994831c634f31d3a2d7edc754524b77aabde296a7ca3be13d86ff19a',
        tools: [
          {
            checksum: 'SHA-256:69293e0de2eff8de89f553477795c25005f674a320bbba4b0222beb0194aa297',
            name: 'avrdude',
            packager: 'arduino',
            signature: '45c81d05ef0b7f30b82d551d6520ef30d34039c1f462a29481f5edf42c1f9dfddb8f6b7022cce36f89cc13bb170dab1c5e0f98152871ec7750423d43bebb9bdfab8eb6e2d9e7a071d1d957437b4b0f37183c5e52ae81d79305d604037f54ea041444160594b912b713fcc52c823e16fc9bbf8dc3afde1eb7c59be4380a4bea066a01308859bd0963987bacb37197588120f3cf3c97441d2332bf2d3575ea74a31678755f2022a1afc881c91d69fb1b74dfd26c9feeb7578ab98721e7b5cd4b5ec090aa5fa4aeaad833a9446066295c13e5ea7b2031a9e8d3666a312c06f6eecce00d82287de0074267ee3bf4de4fa5d88d450487c3de05fded50d9822458dcba',
            url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i686-w64-mingw32.zip',
            version: '6.3.0-arduino14',
          },
        ],
      },
    },
    'arduino:avr:mega': {
      'darwin:amd64': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega2560 -cwiring "-P{serial.port}" -b115200 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: {
          use_1200bps_touch: false,
          wait_for_upload_port: false,
        },
        signature: '0011a459acfa1ce1de0509f30691001a90c397c6d4e5d72a618fa54d343ca242d8c9fb7928e48b2e72613fa2614617838b6769f28ee1881e6f91680e4330541ad16621e1cf04013dc96f063df561253fee22315de35f227ad5757a6af38036985e66a9cacf4b5387ebed37f027080ba33d17265c2e47ea7e5b956c36647891e1eadf9d3eda76cac879a28243201947f2855e9460c41dd839bf24dbe0aeea1e16575a539aff9b4d1b053ea171b4bcdbbb6434718283103cb3ff0e059a7096eb61e5465dbb22ebcdd292e999cac8dd9c08707119a3807c210a85a22646b835b4256f633de71348be47638552539043de8c3aeefd8d04d32a72d1fa3210f594775c',
        tools: [
          {
            checksum: 'SHA-256:47d03991522722ce92120c60c4118685b7861909d895f34575001137961e4a63',
            name: 'avrdude',
            packager: 'arduino',
            signature: '2e097f9a3fdfbaae2dc130433ece784cc60fb5af884b56297d7c3f3c5d3a6aa0b0d74eb3cdcb8c91713c2c02da18031aed951b58534935788072beccc03d8d6b4ad704e3a8b55ae4635ce44f5fa20d965bc0a8b24991821d3d48314ac06603dde23d95b8f9b17e0efa6c12657dd47ce168df85c88b01d2655a3eada2869902c81b9054749ac50bba8ec97976d3c5d37e835891d9dc0135b67605834ddb41a1fbe06161a6e3d62e166ec78ead735e0bce403f3567d0ad4d0211211b9f07437ee464cdf4d43cb31bf7e7aff0a5bd317ad8b4582505c6c891952f65567d6701538e65cf932840e9f1dca1c94c09634406cdd23887d4bd51e034bdb094d8d552f037',
            url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i386-apple-darwin11.tar.bz2',
            version: '6.3.0-arduino14',
          },
        ],
      },
      'windows:386': {
        commandline: '"{runtime.tools.avrdude.path}/bin/avrdude" "-C{runtime.tools.avrdude.path}/etc/avrdude.conf" -v  -patmega2560 -cwiring "-P{serial.port}" -b115200 -D "-Uflash:w:{build.path}/{build.project_name}.hex:i"',
        options: {
          use_1200bps_touch: false,
          wait_for_upload_port: false,
        },
        signature: '0011a459acfa1ce1de0509f30691001a90c397c6d4e5d72a618fa54d343ca242d8c9fb7928e48b2e72613fa2614617838b6769f28ee1881e6f91680e4330541ad16621e1cf04013dc96f063df561253fee22315de35f227ad5757a6af38036985e66a9cacf4b5387ebed37f027080ba33d17265c2e47ea7e5b956c36647891e1eadf9d3eda76cac879a28243201947f2855e9460c41dd839bf24dbe0aeea1e16575a539aff9b4d1b053ea171b4bcdbbb6434718283103cb3ff0e059a7096eb61e5465dbb22ebcdd292e999cac8dd9c08707119a3807c210a85a22646b835b4256f633de71348be47638552539043de8c3aeefd8d04d32a72d1fa3210f594775c',
        tools: [
          {
            checksum: 'SHA-256:69293e0de2eff8de89f553477795c25005f674a320bbba4b0222beb0194aa297',
            name: 'avrdude',
            packager: 'arduino',
            signature: '45c81d05ef0b7f30b82d551d6520ef30d34039c1f462a29481f5edf42c1f9dfddb8f6b7022cce36f89cc13bb170dab1c5e0f98152871ec7750423d43bebb9bdfab8eb6e2d9e7a071d1d957437b4b0f37183c5e52ae81d79305d604037f54ea041444160594b912b713fcc52c823e16fc9bbf8dc3afde1eb7c59be4380a4bea066a01308859bd0963987bacb37197588120f3cf3c97441d2332bf2d3575ea74a31678755f2022a1afc881c91d69fb1b74dfd26c9feeb7578ab98721e7b5cd4b5ec090aa5fa4aeaad833a9446066295c13e5ea7b2031a9e8d3666a312c06f6eecce00d82287de0074267ee3bf4de4fa5d88d450487c3de05fded50d9822458dcba',
            url: 'http://downloads.arduino.cc/tools/avrdude-6.3.0-arduino14-i686-w64-mingw32.zip',
            version: '6.3.0-arduino14',
          },
        ],
      },
    },
  },
};


export {
  COMPUTE,
};
