// Apps tracked by the release feed, grouped by category.
// Add or remove a line to change what shows up. Repos that don't exist are hidden.

export const CATEGORIES = [
  { id: 'jailbreak', name: 'Jailbreak and loaders' },
  { id: 'tools', name: 'Managers and tools' },
  { id: 'stores', name: 'Homebrew stores' },
  { id: 'emulators', name: 'Emulators' },
  { id: 'pc', name: 'PC, Linux and Steam' },
  { id: 'ports', name: 'Recomps and ports' }
];

const J = 'jailbreak', T = 'tools', S = 'stores', E = 'emulators', P = 'pc', R = 'ports';

export const SOURCES = [
  // Jailbreak and loaders
  { cat: J, repo: 'etaHEN/etaHEN', name: 'etaHEN', about: 'Homebrew enabler' },
  { cat: J, repo: 'aydencharles/onionHEN', name: 'OnionHEN', about: 'Homebrew enabler' },
  { cat: J, repo: 'EchoStretch/kstuff', name: 'kstuff', about: 'Kernel patch payload' },
  { cat: J, repo: 'EchoStretch/kstuff-lite', name: 'kstuff lite', about: 'Lightweight kstuff' },
  { cat: J, repo: 'drakmor/kstuff-lite', name: 'kstuff lite (drakmor)', about: 'kstuff lite fork' },
  { cat: J, repo: 'ntfargo/Relapse-Exploit', name: 'Relapse', about: 'Kernel exploit, 7.00 to 13.60' },
  { cat: J, repo: 'Gezine/Y2JB', name: 'Y2JB', about: 'YouTube app entry point' },
  { cat: J, repo: 'itsPLK/ps5-y2jb-autoloader', name: 'Y2JB Autoloader', about: 'Autoload via YouTube, 4.03 to 13.60' },
  { cat: J, repo: 'itsPLK/ps5-webkit-autoloader', name: 'WebKit Autoloader', about: 'Autoload via the browser' },
  { cat: J, repo: 'shahrilnet/remote_lua_loader', name: 'Remote Lua Loader', about: 'Lua payload loader' },
  { cat: J, repo: 'ps5-payload-dev/elfldr', name: 'elfldr', about: 'ELF loader on port 9021' },
  { cat: J, repo: 'PS5Dev/Byepervisor', name: 'Byepervisor', about: 'Hypervisor exploit' },

  // Managers and tools
  { cat: T, repo: 'itsPLK/ps5-payload-manager', name: 'Payload Manager', about: 'Web dashboard for payloads and autoload' },
  { cat: T, repo: 'phantomptr/ps5upload', name: 'PS5 Upload', about: 'Send games and apps, manage the console' },
  { cat: T, repo: 'drakmor/ShadowMountPlus', name: 'ShadowMountPlus', about: 'Auto-mounts game dumps' },
  { cat: T, repo: 'xvvulcanvx/PS5-TabShifter', name: 'TabShifter', about: 'Move apps between Games and Media' },
  { cat: T, repo: 'TheCriicom/omega-dashboard', name: 'Omega Dashboard', about: 'Replacement home screen' },
  { cat: T, repo: 'NotSoTypicalGamer/ShadowPKG', name: 'ShadowPKG', about: 'Self-hosted PKG manager' },
  { cat: T, repo: 'manos555555/PS5-Suite', name: 'PS5-Suite', about: 'File transfer and console management' },
  { cat: T, repo: 'juma-sayeh/PS5-Game-Compressor', name: 'PS5 Game Compressor', about: 'Shrink and move game dumps' },
  { cat: T, repo: 'VenezuelanBiggie24/MacheteSVG-PS5-Save-Manager', name: 'MacheteSVG', about: 'Save manager' },
  { cat: T, repo: 'LightningMods/Itemzflow', name: 'Itemzflow', about: 'Game launcher and manager' },
  { cat: T, repo: 'ps5-payload-dev/ftpsrv', name: 'ftpsrv', about: 'FTP server on port 2121' },
  { cat: T, repo: 'ps5-payload-dev/websrv', name: 'websrv', about: 'Web server on port 8080' },
  { cat: T, repo: 'ps5-payload-dev/sdk', name: 'PS5 Payload SDK', about: 'Toolchain for payloads' },

  // Homebrew stores
  { cat: S, repo: 'blackbearreloaded/ProsperoStore', name: 'ProsperoStore', about: 'Store for the homebrew.page catalog' },
  { cat: S, repo: 'elripalda/RecompStore', name: 'RecompStore', about: 'Installs recompiled ports from your discs' },

  // Emulators
  { cat: E, repo: 'Swordpdf/PS5SX2', name: 'PS5SX2', about: 'PS2, based on PCSX2' },
  { cat: E, repo: 'kamb205/KB-RPCS3', name: 'KB-RPCS3', about: 'PS3, based on RPCS3' },
  { cat: E, repo: 'blackbearreloaded/ProsperoEden', name: 'ProsperoEden', about: 'Switch, based on Eden' },
  { cat: E, repo: 'elripalda/Porpoise-Dolphin-Emulator-for-PS5', name: 'Porpoise', about: 'GameCube and Wii, based on Dolphin' },
  { cat: E, repo: 'premohq/PS5CEMU-HAR', name: 'PS5CEMU-HAR', about: 'Wii U and 3DS, Cemu and Azahar' },
  { cat: E, repo: 'BrinooTk/PS5X360', name: 'PS5X360', about: 'Xbox 360, based on Xenia' },
  { cat: E, repo: 'ZiZc3/XPSemu', name: 'XPSemu', about: 'Original Xbox, based on xemu' },
  { cat: E, repo: 'mihawk-99/PS5_RetroArch', name: 'RetroArch', about: 'Multi-system, includes GBA' },
  { cat: E, repo: 'TheRealRetro/mupen64plus-ps5', name: 'mupen64plus', about: 'Nintendo 64' },
  { cat: E, repo: 'BaZZtian/SilverBirch', name: 'SilverBirch', about: 'Nintendo DS, based on melonDS' },
  { cat: E, repo: 'SynoPiia/PSXS5', name: 'PSXS5', about: 'PS1, based on PCSX-ReARMed' },
  { cat: E, repo: 'MisterTemaki/snes9xPS5', name: 'Snes9x', about: 'SNES' },
  { cat: E, repo: 'MisterTemaki/fbneo-ps5', name: 'FinalBurn Neo', about: 'Arcade' },

  // PC, Linux and Steam
  { cat: P, repo: 'ps5-linux/ps5-linux-loader', name: 'ps5-linux', about: 'Linux loader, low firmware' },
  { cat: P, repo: 'pLabs5/pLinux5-NG', name: 'pLinux5-NG', about: 'Linux on higher firmware, early' },
  { cat: P, repo: 'mpereiraesaa/prospero-win', name: 'prospero-win', about: 'Wine for PS5 homebrew' },
  { cat: P, repo: 'leolobato/playden-ps5', name: 'Playden', about: 'Play your Steam Windows games' },
  { cat: P, repo: 'RafaelNGP/xbox-cloud-gaming-ps5', name: 'PSBox Cloud Gaming', about: 'Xbox Cloud Gaming client' },
  { cat: P, repo: 'bizkut/ps5-pokemmo', name: 'PokeMMO for PS5', about: 'PokeMMO client through Wine' },

  // Recomps and ports
  { cat: R, repo: 'griches/PS5_Ghostship', name: 'Super Mario 64', about: 'Ghostship port, bring your own ROM' },
  { cat: R, repo: 'griches/PS5_WindWakerHD', name: 'Wind Waker HD', about: 'Recomp port, bring your own dump' },
  { cat: R, repo: 'griches/PS5_SwitchWaker', name: 'Wind Waker', about: 'GameCube version, bring your own dump' },
  { cat: R, repo: 'griches/PS5_Sunshine', name: 'Super Mario Sunshine', about: 'PC port, bring your own dump' },
  { cat: R, repo: 'griches/PS5_Dusklight', name: 'Dusklight', about: 'Twilight Princess port, bring your own disc' },
  { cat: R, repo: 'Marice/rush2-ps5', name: 'Rush 2 Recompiled', about: 'N64 recomp' },
  { cat: R, repo: 'griches/PS5_Doom3', name: 'Doom 3 BFG', about: 'RBDoom3BFG port, bring your own copy' },
  { cat: R, repo: 'griches/PS5_Quake3e', name: 'Quake III', about: 'Quake3e engine port' },
  { cat: R, repo: 'Marice/stk-ps5', name: 'SuperTuxKart', about: 'Open-source kart racer' }
];
