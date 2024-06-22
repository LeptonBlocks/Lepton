const blocks = (extFacePanels) => ([{
        "opcode": "BLOCK_1719039285417",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "num": {
                "type": "number",
                "defaultValue": 1
            },
            "din": {
                "type": "number",
                "defaultValue": 12
            },
            "cs": {
                "type": "number",
                "defaultValue": 11
            },
            "clk": {
                "type": "number",
                "defaultValue": 10
            },
            "panels": {
                "type": "number",
                "defaultValue": 1
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "sections": {
                    "include": [
                        "\"src/Lepton-MAX7219/LedControl.h\""
                    ],
                    "declare": `LedControl lepton_ledcontrol/*{num}*/ = LedControl(/*{din}*/, /*{clk}*/, /*{cs}*/, /*{panels}*/);`,
                    "setup": `for(int lepton_i=0; lepton_i<lepton_ledcontrol/*{num}*/.getDeviceCount(); lepton_i++) {\n    /* Wake up device */\n    lepton_ledcontrol/*{num}*/.shutdown(lepton_i, false); \n    /* Set the brightness to a medium value */\n    lepton_ledcontrol/*{num}*/.setIntensity(lepton_i, 8);\n    /* and clear the display */\n    lepton_ledcontrol/*{num}*/.clearDisplay(lepton_i);\n} \n\nlepton_ledcontrol/*{num}*/.setRow(1,0,63);`
                }
            }
        },
        "handler": this.funcs.BLOCK_1719039285417
    },
    {
        "opcode": "BLOCK_1719040511271",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "num": {
                "type": "number",
                "defaultValue": 1
            },
            "panel": {
                "type": "number",
                "defaultValue": 1
            },
            "figure": extFacePanels['8233d424']
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `for (int lepton_i = 0; lepton_i < 8; lepton_i++) {\n    char lepton_chunk[9];\n    strncpy(lepton_chunk, \"/*{figure}*/\" + lepton_i * 8, 8);\n    lepton_chunk[8] = '\\0';\n    lepton_ledcontrol/*{num}*/.setRow(/*{panel}*/-1, lepton_i, strtol(lepton_chunk, NULL, 2));\n}`
            }
        },
        "handler": this.funcs.BLOCK_1719040511271
    },
    {
        "opcode": "BLOCK_1719044216290",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "num": {
                "type": "number",
                "defaultValue": 1
            },
            "panel": {
                "type": "number",
                "defaultValue": 1
            },
            "value": {
                "type": "number",
                "defaultValue": 1
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_ledcontrol/*{num}*/.setIntensity(/*{panel}*/-1, /*{value}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1719044216290
    },
    {
        "opcode": "BLOCK_1719043487366",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "num": {
                "type": "number",
                "defaultValue": 1
            },
            "panel": {
                "type": "number",
                "defaultValue": 1
            },
            "powerDown": {
                "type": "fieldMenu",
                "defaultValue": "true",
                "menu": "BLOCK_1719043487366_POWERDOWN"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_ledcontrol/*{num}*/.shutdown(/*{panel}*/-1, /*{powerDown}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1719043487366
    },
    {
        "opcode": "BLOCK_1719043877542",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "num": {
                "type": "number",
                "defaultValue": 1
            },
            "panel": {
                "type": "number",
                "defaultValue": 1
            },
            "row": {
                "type": "number",
                "defaultValue": 1
            },
            "col": {
                "type": "number",
                "defaultValue": 1
            },
            "on": {
                "type": "fieldMenu",
                "defaultValue": "true",
                "menu": "BLOCK_1719043877542_ON"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_ledcontrol/*{num}*/.setLed(/*{panel}*/-1, /*{row}*/-1, /*{col}*/-1, /*{on}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1719043877542
    }
]);

export default blocks;