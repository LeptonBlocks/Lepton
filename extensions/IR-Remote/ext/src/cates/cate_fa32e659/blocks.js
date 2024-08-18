const blocks = (extFacePanels) => ([{
        "opcode": "BLOCK_1713216604395",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "pin": {
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
                        "\"src/Lepton-IR-Remote/IRremote.hpp\""
                    ],
                    "declare": `const char* lepton_ir_protocols[] = {\n    \"UNKNOWN\",\n    \"PULSE_WIDTH\",\n    \"PULSE_DISTANCE\",\n    \"APPLE\",\n    \"DENON\",\n    \"JVC\",\n    \"LG\",\n    \"LG2\",\n    \"NEC\",\n    \"NEC2\",\n    \"ONKYO\",\n    \"PANASONIC\",\n    \"KASEIKYO\",\n    \"KASEIKYO_DENON\",\n    \"KASEIKYO_SHARP\",\n    \"KASEIKYO_JVC\",\n    \"KASEIKYO_MITSUBISHI\",\n    \"RC5\",\n    \"RC6\",\n    \"SAMSUNG\",\n    \"SAMSUNGLG\",\n    \"SAMSUNG48\",\n    \"SHARP\",\n    \"SONY\",\n    \"BANG_OLUFSEN\",\n    \"BOSEWAVE\",\n    \"LEGO_PF\",\n    \"MAGIQUEST\",\n    \"WHYNTER\",\n    \"FAST\"\n};\n\nconst int lepton_ir_protocols_num = sizeof(lepton_ir_protocols) / sizeof(lepton_ir_protocols[0]);\n\nString lepton_ir_protocols_to_string(int number) {\n    if (number >= 0 && number < lepton_ir_protocols_num) {\n        return String(lepton_ir_protocols[number]);\n    } else {\n        return \"OUT_OF_RANGE\";\n    }\n}`,
                    "setup": ` IrReceiver.begin(/*{pin}*/, ENABLE_LED_FEEDBACK);`
                }
            }
        },
        "handler": this.funcs.BLOCK_1713216604395
    },
    {
        "opcode": "BLOCK_1713216604631",
        "blockType": "boolean",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {},
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `IrReceiver.decode()`
            }
        },
        "handler": this.funcs.BLOCK_1713216604631
    },
    {
        "opcode": "BLOCK_1713216604820",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {},
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `IrReceiver.resume();`
            }
        },
        "handler": this.funcs.BLOCK_1713216604820
    },
    {
        "opcode": "BLOCK_1713216605004",
        "blockType": "number",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {},
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `IrReceiver.decodedIRData.command`
            }
        },
        "handler": this.funcs.BLOCK_1713216605004
    },
    {
        "opcode": "BLOCK_1713216605193",
        "blockType": "string",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {},
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_ir_protocols_to_string(IrReceiver.decodedIRData.protocol)`
            }
        },
        "handler": this.funcs.BLOCK_1713216605193
    },
    {
        "opcode": "BLOCK_1713216605384",
        "blockType": "string",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {},
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `String(IrReceiver.decodedIRData.decodedRawData, HEX)`
            }
        },
        "handler": this.funcs.BLOCK_1713216605384
    }
]);

export default blocks;