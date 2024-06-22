const blocks = (extFacePanels) => ([{
        "opcode": "BLOCK_1712698492010",
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
                "sections": {
                    "include": [
                        "\"src/Lepton-RTC-DS3231/DS3231.h\""
                    ],
                    "declare": `DS3231 lepton_clock;\nRTCDateTime lepton_dt;`,
                    "setup": `lepton_clock.begin();`
                }
            }
        },
        "handler": this.funcs.BLOCK_1712698492010
    },
    {
        "opcode": "BLOCK_1713188274574",
        "blockType": "command",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "year": {
                "type": "number",
                "defaultValue": 2024
            },
            "month": {
                "type": "number",
                "defaultValue": 12
            },
            "date": {
                "type": "number",
                "defaultValue": 31
            },
            "hour": {
                "type": "number",
                "defaultValue": 23
            },
            "minute": {
                "type": "number",
                "defaultValue": 59
            },
            "second": {
                "type": "number",
                "defaultValue": 59
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockweb",
            "mblockpc"
        ],
        "codes": {
            "arduinoc": {
                "sections": {
                    "setup": `lepton_clock.setDateTime(/*{year}*/, /*{month}*/, /*{date}*/, /*{hour}*/, /*{minute}*/, /*{second}*/);`
                }
            }
        },
        "handler": this.funcs.BLOCK_1713188274574
    },
    {
        "opcode": "BLOCK_1713174673422",
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
                "code": `lepton_dt = lepton_clock.getDateTime();`
            }
        },
        "handler": this.funcs.BLOCK_1713174673422
    },
    {
        "opcode": "BLOCK_1713175967062",
        "blockType": "number",
        "checkboxInFlyout": false,
        "hidden": false,
        "gap": 12,
        "arguments": {
            "field": {
                "type": "fieldMenu",
                "defaultValue": "second",
                "menu": "BLOCK_1713175967062_FIELD"
            }
        },
        "branchCount": 0,
        "platform": [
            "mblockpc",
            "mblockweb"
        ],
        "codes": {
            "arduinoc": {
                "code": `lepton_dt./*{field}*/`
            }
        },
        "handler": this.funcs.BLOCK_1713175967062
    }
]);

export default blocks;