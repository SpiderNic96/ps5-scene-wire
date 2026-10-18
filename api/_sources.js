// Hand-picked apps tracked by the release feed, grouped by category.
// Everything in the ProsperoStore (homebrew.page) catalogue is added on top of these
// automatically by _catalog.js. Add a line here to track something the catalogue
// doesn't have, or to override how a catalogue entry is named or grouped.
// Repos that don't exist are hidden.

export const CATEGORIES = [
  { id: 'jailbreak', name: 'Jailbreak and loaders' },
  { id: 'tools', name: 'Apps and tools' },
  { id: 'stores', name: 'Homebrew stores' },
  { id: 'emulators', name: 'Emulators' },
  { id: 'ports', name: 'Recomps, ports and games' },
  { id: 'media', name: 'Media and streaming' },
  { id: 'pc', name: 'PC, Linux and Steam' }
];

const J = 'jailbreak', T = 'tools', S = 'stores', E = 'emulators', P = 'pc', R = 'ports', M = 'media';

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
  { cat: J, repo: 'ArkSama/PS5-Lapy-JB-Daemon', name: 'Lapy JB Daemon', about: 'etaHEN-style jailbreak on demand for apps' },
  { cat: J, repo: 'Phoenixx1202/LegacyJB', name: 'LegacyJB', about: 'Jailbreak service for apps, port 9028' },
  { cat: J, repo: 'drakmor/ppr-patch', name: 'ppr-patch', about: 'A53 PPR patcher' },
  { cat: J, repo: 'drakmor/nanoDNS', name: 'nanoDNS', about: 'DNS proxy payload' },
  { cat: J, repo: 'lvndry/ps5-firmware-pin', name: 'ps5-firmware-pin', about: 'Blocks firmware updates' },
  { cat: J, repo: 'pastawithpesto/PS5-14.10-Jailbreak-Research', name: 'PS5 14.10 Jailbreak Research', about: 'WebKit exploit research for firmware 14.10' },

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
  { cat: T, repo: 'notmaj0r/ProsperoMgr', name: 'ProsperoMgr', about: 'Web-based all-in-one manager, port 7070' },
  { cat: T, repo: 'SvenGDK/Prospero-Explorer', name: 'Prospero Explorer', about: 'File explorer on SharpProspero' },
  { cat: T, repo: 'kerrdec97/PS5-Backport-GUI', name: 'PS5 Backport GUI', about: 'Batch backporting for lower firmware' },
  { cat: T, repo: 'theghostonline/007-First-Light-PS5', name: '007 First Light Online', about: 'Local backend for online features' },
  { cat: T, repo: 'theghostonline/Hitman-PS5', name: 'Hitman-PS5', about: 'Local backend for HITMAN online' },
  { cat: T, repo: 'bps2414/lineup', name: 'Lineup', about: 'Reorder the home screen game row' },
  { cat: T, repo: 'cobanov/PS5LM', name: 'PS5LM', about: 'llama.cpp language models on PS5' },
  { cat: T, repo: 'knutwurst/ps5-patchdl', name: 'PatchDL', about: 'Download official game updates' },
  { cat: T, repo: 'gasb07/ps4mount', name: 'ps4mount', about: 'Run PS4 games from USB' },
  { cat: T, repo: 'Starter-ps5/Common-FPS-for-PS5', name: 'Common-FPS', about: 'Real-time FPS overlay' },
  { cat: T, repo: 'hebiii994/ps5-solobridge', name: 'ps5-solobridge', about: 'USB audio to Focusrite Scarlett Solo' },
  { cat: T, repo: 'psksuffsmp/ps5-stream8', name: 'Stream8', about: 'Hardware H.264 streaming to browser' },
  { cat: T, repo: 'Darkatek7/ProsperoThemes', name: 'Prospero Themes', about: 'Theme manager for the PS5 home screen' },
  { cat: T, repo: 'StonedModder/Prospero-Menu', name: 'ProsperoMenu', about: 'Community overlay menu, L3+R3 in any app' },
  { cat: T, repo: 'eladharels/ps5-60FPS', name: 'fps60', about: '60 FPS unlock for PS4 and PS5 games' },
  { cat: T, repo: 'ShaneBreazeale/ps5-homebrew-tools', name: 'PS5 Homebrew Tools', about: 'Diagnostic payloads for PS5 development' },

  // Homebrew stores
  { cat: S, repo: 'blackbearreloaded/ProsperoStore', name: 'ProsperoStore', about: 'Store for the homebrew.page catalog' },
  { cat: S, repo: 'elripalda/RecompStore', name: 'RecompStore', about: 'Installs recompiled ports from your discs' },
  { cat: S, repo: 'JVK3R/JobeesLair', name: 'Jobee’sLair', about: 'Feed-based homebrew download manager' },

  // Emulators
  { cat: E, repo: 'Swordpdf/PS5SX2', name: 'PS5SX2', about: 'PS2, based on PCSX2' },
  { cat: E, repo: 'kamb205/KB-RPCS3', name: 'KB-RPCS3', about: 'PS3, based on RPCS3' },
  { cat: E, repo: 'blackbearreloaded/ProsperoEden', name: 'ProsperoEden', about: 'Switch, based on Eden' },
  { cat: E, repo: 'elripalda/Porpoise-Dolphin-Emulator-for-PS5', name: 'Porpoise', about: 'GameCube and Wii, based on Dolphin' },
  { cat: E, repo: 'premohq/PS5CEMU-HAR', name: 'PS5CEMU-HAR', about: 'Wii U and 3DS, Cemu and Azahar' },
  { cat: E, repo: 'mortaljinx/Seedee5', name: 'Seedee5', about: 'Philips CD-i, based on MAME SAME_CDI' },
  { cat: E, repo: 'BrinooTk/PS5X360', name: 'PS5X360', about: 'Xbox 360, based on Xenia' },
  { cat: E, repo: 'ZiZc3/XPSemu', name: 'XPSemu', about: 'Original Xbox, based on xemu' },
  { cat: E, repo: 'mihawk-99/PS5_RetroArch', name: 'RetroArch', about: 'Multi-system, includes GBA' },
  { cat: E, repo: 'TheRealRetro/mupen64plus-ps5', name: 'mupen64plus', about: 'Nintendo 64' },
  { cat: E, repo: 'BaZZtian/SilverBirch', name: 'SilverBirch', about: 'Nintendo DS, based on melonDS' },
  { cat: E, repo: 'SynoPiia/PSXS5', name: 'PSXS5', about: 'PS1, based on PCSX-ReARMed' },
  { cat: E, repo: 'MisterTemaki/snes9xPS5', name: 'Snes9x', about: 'SNES' },
  { cat: E, repo: 'MisterTemaki/fbneo-ps5', name: 'FinalBurn Neo', about: 'Arcade' },
  { cat: E, repo: 'tsuramatsu1/psp5', name: 'psp5', about: 'PSP, based on PPSSPP' },
  { cat: E, repo: 'MisterTemaki/genplusgxPS5', name: 'Genesis Plus GX', about: 'Mega Drive, Master System, Game Gear' },
  { cat: E, repo: 'MisterTemaki/beetlepcePS5', name: 'Beetle PCE', about: 'PC Engine and TurboGrafx-16' },
  { cat: E, repo: 'darkxex/SwanStationPS5', name: 'SwanStationPS5', about: 'PS1, Vulkan, RetroAchievements' },

  // PC, Linux and Steam
  { cat: P, repo: 'ps5-linux/ps5-linux-loader', name: 'ps5-linux', about: 'Linux loader, low firmware' },
  { cat: P, repo: 'pLabs5/pLinux5-NG', name: 'pLinux5-NG', about: 'Linux on higher firmware, early' },
  { cat: P, repo: 'mpereiraesaa/prospero-win', name: 'prospero-win', about: 'Wine for PS5 homebrew' },
  { cat: P, repo: 'leolobato/playden-ps5', name: 'Playden', about: 'Play your Steam Windows games' },
  { cat: P, repo: 'bizkut/ps5-pokemmo', name: 'PokeMMO for PS5', about: 'PokeMMO client through Wine' },

  // Media and streaming
  { cat: M, repo: 'RafaelNGP/xbox-cloud-gaming-ps5', name: 'PSBox Cloud Gaming', about: 'Xbox Cloud Gaming client' },
  { cat: M, repo: 'Sp9nky/unofficial-stremio-ps5-port', name: 'Stremio', about: 'Unofficial Stremio client' },
  { cat: M, repo: 'stupiditytries/StremiBrew', name: 'StremiBrew', about: 'Another native Stremio port' },
  { cat: M, repo: 'bornaradusin/Emby5', name: 'Emby5', about: 'Emby client' },
  { cat: M, repo: '02dnot/Jelly5', name: 'Jelly5', about: 'Jellyfin and Emby client' },
  { cat: M, repo: 'ZiZc3/VLC', name: 'VLC', about: 'VLC media player' },
  { cat: M, repo: 'blackbearreloaded/ProsperoTube', name: 'ProsperoTube', about: 'YouTube client based on SmartTube' },
  { cat: M, repo: 'theghostonline/PS5VR', name: 'PS5VR', about: 'VR video player for PSVR2' },
  { cat: M, repo: 'fstat13/PSCapture', name: 'PSCapture', about: 'Virtual capture card for OBS and Discord' },

  // Recomps and ports
  { cat: R, repo: 'Nazky/UnleashedRecomp-Prospero', name: 'Sonic Unleashed Recompiled', about: 'Xbox 360 recomp, bring your own copy' },
  { cat: R, repo: 'LoZazaMastro/TheSimpsonsGame-PS5-Builder', name: 'The Simpsons Game', about: 'Xbox 360 recomp builder, bring your own copy' },
  { cat: R, repo: 'KongaTime/PS5_EdgeOfTimeTitle', name: 'Spider-Man: Edge of Time', about: 'Xbox 360 recomp, bring your own copy' },
  { cat: R, repo: 'elripalda/fifastreet-ps5', name: 'FIFA Street (2012)', about: 'Xbox 360 recomp' },
  { cat: R, repo: 'elripalda/wwe13-ps5', name: "WWE '13", about: 'Xbox 360 recomp' },
  { cat: R, repo: 'hollamhide/hollamhide.github.io', name: 'Mario Kart Wii (PS5)', about: 'Wii recomp' },
  { cat: R, repo: 'cherryduck/PS5_EccoDefender', name: 'Ecco the Dolphin: Defender of the Future', about: 'Dreamcast recomp' },
  { cat: R, repo: 'Marice/wave-race-64-ps5', name: 'Wave Race 64 Recompiled', about: 'N64 recomp' },
  { cat: R, repo: 'mshivam019/oot64-ps5', name: 'Ship of Harkinian (Ocarina of Time)', about: 'Ocarina of Time port' },
  { cat: R, repo: 'mshivam019/tmm64-ps5', name: '2 Ship 2 Harkinian (Majora’s Mask)', about: 'Majora’s Mask port' },
  { cat: R, repo: 'mshivam019/la-ps5', name: 'Link’s Awakening', about: 'Link’s Awakening port' },
  { cat: R, repo: 'griches/PS5_Ghostship', name: 'Super Mario 64', about: 'Ghostship port, bring your own ROM' },
  { cat: R, repo: 'griches/PS5_WindWakerHD', name: 'Wind Waker HD', about: 'Recomp port, bring your own dump' },
  { cat: R, repo: 'griches/PS5_SwitchWaker', name: 'Wind Waker', about: 'GameCube version, bring your own dump' },
  { cat: R, repo: 'griches/PS5_Sunshine', name: 'Super Mario Sunshine', about: 'PC port, bring your own dump' },
  { cat: R, repo: 'griches/PS5_Dusklight', name: 'Dusklight', about: 'Twilight Princess port, bring your own disc' },
  { cat: R, repo: 'Marice/rush2-ps5', name: 'Rush 2 Recompiled', about: 'N64 recomp' },
  { cat: R, repo: 'griches/PS5_Doom3', name: 'Doom 3 BFG', about: 'RBDoom3BFG port, bring your own copy' },
  { cat: R, repo: 'griches/PS5_Quake3e', name: 'Quake III', about: 'Quake3e engine port' },
  { cat: R, repo: 'Marice/stk-ps5', name: 'SuperTuxKart', about: 'Open-source kart racer' },
  { cat: R, repo: 'griches/PS5_DevilutionX', name: 'DevilutionX', about: 'Diablo and Hellfire, bring your own data' },
  { cat: R, repo: 'elripalda/nbastreet-ps5', name: 'NBA Street Homecourt', about: 'Xbox 360 recomp, 1440p60' },
  { cat: R, repo: 'elripalda/skate3-ps5', name: 'Skate 3', about: 'Xbox 360 recomp' }
];
