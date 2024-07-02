const blocks = (extFacePanels) => ([{
        "opcode": "BLOCK_1713207948139",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "port": {
                "type": "fieldMenu",
                "defaultValue": "0x27",
                "menu": "BLOCK_1713207948139_PORT"
            },
            "columns": {
                "type": "number",
                "defaultValue": 16
            },
            "rows": {
                "type": "number",
                "defaultValue": 2
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
                        "\"I2C_LCD/I2C_LCD.h\"",
                        "\"I2C_LCD/I2C_LCD_special_chars.h\""
                    ],
                    "declare": `I2C_LCD lepton_lcd(/*{port}*/);\n\nuint8_t lepton_lcd_custom_char[8]; // Fixed size for 8 elements\n\nvoid lepton_lcd_panel(const char* binaryStr) {\n    // Reset the array to all zeroes\n    for (int i = 0; i < 8; ++i) {\n        lepton_lcd_custom_char[i] = 0;\n    }\n\n    for (int i = 0; i < 40; i++) {\n        // Calculate the row and column indices\n        int row = i % 8;\n        int col = 4 - i / 8;\n\n        // Convert the character '0' or '1' to a bit\n        uint8_t bit = (binaryStr[i] == '1') ? 1 : 0;\n\n        // Set the corresponding bit in the result array\n        lepton_lcd_custom_char[row] |= (bit << col);\n    }\n}`,
                    "setup": `lepton_lcd.begin(/*{columns}*/, /*{rows}*/);`
                }
            }
        },
        "handler": this.funcs.BLOCK_1713207948139
    },
    {
        "opcode": "BLOCK_1713209371216",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "command": {
                "type": "fieldMenu",
                "defaultValue": "clear",
                "menu": "BLOCK_1713209371216_COMMAND"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_lcd./*{command}*/();`
            }
        },
        "handler": this.funcs.BLOCK_1713209371216
    },
    {
        "opcode": "BLOCK_1713210277889",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "row": {
                "type": "number",
                "defaultValue": 1
            },
            "column": {
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
                "code": `lepton_lcd.setCursor(/*{column}*/-1, /*{row}*/-1);`
            }
        },
        "handler": this.funcs.BLOCK_1713210277889
    },
    {
        "opcode": "BLOCK_1713210091134",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "string": {
                "type": "string",
                "defaultValue": "text"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_lcd.print(/*{string}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1713210091134
    },
    {
        "opcode": "BLOCK_1713210132755",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "string": {
                "type": "string",
                "defaultValue": "text"
            },
            "row": {
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
                "code": `lepton_lcd.center(/*{row}*/-1, /*{string}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1713210132755
    },
    {
        "opcode": "BLOCK_1713210192368",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "string": {
                "type": "string",
                "defaultValue": "text"
            },
            "row": {
                "type": "number",
                "defaultValue": 1
            },
            "column": {
                "type": "number",
                "defaultValue": 16
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_lcd.right(/*{column}*/, /*{row}*/-1, /*{string}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1713210192368
    },
    {
        "opcode": "BLOCK_1713210317522",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "direction": {
                "type": "fieldMenu",
                "defaultValue": "Right",
                "menu": "BLOCK_1713210317522_DIRECTION"
            },
            "n": {
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
                "code": `lepton_lcd.moveCursor/*{direction}*/(/*{n}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1713210317522
    },
    {
        "opcode": "BLOCK_1713208634623",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "char": {
                "type": "fieldMenu",
                "defaultValue": "DEGREE",
                "menu": "BLOCK_1713208634623_CHAR"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_lcd.print(LCD_/*{char}*/);`
            }
        },
        "handler": this.funcs.BLOCK_1713208634623
    },
    {
        "opcode": "BLOCK_1713210693769",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "n": {
                "type": "fieldMenu",
                "defaultValue": "1",
                "menu": "BLOCK_1713210693769_N"
            },
            "panel": extFacePanels['cd72e514']
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_lcd_panel(\"/*{panel}*/\");\nlepton_lcd.createChar(/*{n}*/-1, lepton_lcd_custom_char);\nlepton_lcd.setCursor(0, 0); // required after createChar, for some reason, otherwise no display`
            }
        },
        "handler": this.funcs.BLOCK_1713210693769
    },
    {
        "opcode": "BLOCK_1713211789499",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "n": {
                "type": "fieldMenu",
                "defaultValue": "1",
                "menu": "BLOCK_1713210693769_N"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_lcd.special(/*{n}*/-1);`
            }
        },
        "handler": this.funcs.BLOCK_1713211789499
    }
]);

export default blocks;