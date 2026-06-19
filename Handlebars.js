const Handlebars = require("handlebars");

Handlebars.registerHelper("toString", value => {
  if (value === undefined || value === null) return "";
  return String(value);
});

Handlebars.registerHelper("toInt", value => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
});

const payload = {
  inputParams: {
    refNumber: "DEL12345",
    shipmentNumber: "SHIP789",
    servicePartnerNumber: "200045",
    schReferenceNumber: "SCH001",
    selectedRows: {
      Partner: ["300012"],
      refNumber: ["DEL12345"],
      shipmentNumber: ["SHIP789"],
      shmentValue: ["15000"]
    }
  },
  headers: {
    userid: "300012-ABC"
  },
  componentSetting: {
    payload: {
      totalPrice: 50000,
      invAmount: 12000,
      shipmentValue: 30000
    },
    matSortActive: "materialDescription",
    matSortDirection: 1
  }
};

const aggregationTemplate = ` [
    {
      "role": [
        "ES-SPECIFIC-VENDOR-InbShipment"
      ],
      "value": [
        {
          "($)match": {
            "($)or": [
              {
                "externalDeliveryID": "{{toString inputParams.refNumber}}"
              },
              {
                "shipmentNumber": "{{toString inputParams.shipmentNumber}}"
              }
            ],
            "shipmentType": "Z030"
          }
        },
        {
          "($)lookup": {
            "from": "vendors",
            "let": {
              "mainSupplier": "($)mainSupplier"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)eq": [
                          "($)sapAssociateNumber",
                          "($)($)mainSupplier"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)active",
                          true
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "organisationName": 1,
                  "sapAssociateNumber": 1,
                  "userId": 1,
                  "active": 1,
                  "status": 1,
                  "userIds": 1,
                  "bankDetails": 1,
                  "contactDetails": 1
                }
              }
            ],
            "as": "vendr"
          }
        },
        {
          "($)unwind": {
            "path": "($)vendr",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)unwind": {
            "path": "($)item",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)addFields": {
            "vend1": "{{headers.userid}}",
            "vend2": {
              "($)substr": [
                "{{headers.userid}}",
                0,
                {
                  "($)indexOfCP": [
                    "{{headers.userid}}",
                    "-"
                  ]
                }
              ]
            },
            "refDocAndItem": {
              "($)concat": [
                "($)item.refDocument",
                {
                  "($)concat": [
                    {
                      "($)substr": [
                        "000",
                        0,
                        {
                          "($)subtract": [
                            3,
                            {
                              "($)strLenCP": {
                                "($)toString": "($)item.refItem"
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "($)toString": "($)item.refItem"
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "($)lookup": {
            "from": "vendors",
            "let": {
              "vend1": "($)vend1",
              "vend2": "($)vend2"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)or": [
                          {
                            "($)eq": [
                              "($)userId",
                              "($)($)vend1"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)userId",
                              "($)($)vend2"
                            ]
                          }
                        ]
                      },
                      {
                        "($)eq": [
                          "($)active",
                          true
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "organisationName": 1,
                  "sapAssociateNumber": 1,
                  "userId": 1,
                  "active": 1,
                  "status": 1,
                  "userIds": 1,
                  "bankDetails": 1,
                  "contactDetails": 1
                }
              }
            ],
            "as": "vendr1"
          }
        },
        {
          "($)unwind": {
            "path": "($)vendr1",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)lookup": {
            "from": "DespatchDocs",
            "let": {
              "item2": "($)item.refDocument",
              "item1": "($)item.refItem",
              "vendr3": "($)vendr1.sapAssociateNumber",
              "delNo": "($)externalDeliveryID",
              "deliveryNumber": "($)deliveryNumber",
              "deliveryItem": "($)item.itemNumber"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)in": [
                      "($)($)delNo",
                      {
                        "($)ifNull": [
                          "($)items.inboundExtref",
                          []
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)match": {
                  "deliveryStatus": {
                    "($)ne": "Cancelled"
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)items",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)ne": [
                          "($)items.deliveryStatus_i",
                          "QA Reject"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.inboundDelNo",
                          "($)($)deliveryNumber"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.inboundDelItem",
                          "($)($)deliveryItem"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.inboundExtref",
                          "($)($)delNo"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)items.otherCharges",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)eq": [
                          "($)items.otherCharges.chargPurDoc",
                          "($)($)item2"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.otherCharges.chargItem",
                          "($)($)item1"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.otherCharges.chargVendor",
                          "($)($)vendr3"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "items": 1,
                  "deliveryStatus": 1
                }
              }
            ],
            "as": "shipmentGrn2"
          }
        },
        {
          "($)unwind": {
            "path": "($)shipmentGrn2",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)unwind": {
            "path": "($)shipmentGrn2.items",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)unwind": {
            "path": "($)shipmentGrn2.items.otherCharges",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)lookup": {
            "from": "PurchaseDocs",
            "let": {
              "po": "($)item.refDocument",
              "poitem": "($)item.refItem"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)eq": [
                      "($)purchasingDocumentNr",
                      "($)($)po"
                    ]
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)item",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)eq": [
                      "($)item.purchaseDocumentItem",
                      "($)($)poitem"
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "netprice": "($)item.netPrice"
                }
              }
            ],
            "as": "purchaseDocs"
          }
        },
        {
          "($)unwind": {
            "path": "($)purchaseDocs",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)addFields": {
            "shipmentNum": {
              "($)replaceOne": {
                "input": "($)shipmentNumber",
                "find": "^0+",
                "replacement": ""
              }
            }
          }
        },
        {
          "($)lookup": {
            "from": "InboundShipment",
            "let": {
              "shipmentNumber": "($)shipmentNum",
              "po": "($)item.refDocument",
              "poitem": "($)item.refItem",
              "delNo": "($)externalDeliveryID",
              "supplier": "{{toInt inputParams['selectedRows']['Partner']['0']}}",
              "supplier2": "{{toInt inputParams.servicePartnerNumber}}",
              "schReferenceNumber": "{{inputParams.schReferenceNumber}}",
              "supplier3": {
                "($)toInt": "($)vendr1.sapAssociateNumber"
              }
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)or": [
                          {
                            "($)eq": [
                              "($)refNumber",
                              "($)($)delNo"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)shipmentNumber",
                              "($)($)shipmentNumber"
                            ]
                          }
                        ]
                      },
                      {
                        "($)or": [
                          {
                            "($)eq": [
                              "($)sapAssociateNumber",
                              "($)($)supplier"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)sapAssociateNumber",
                              "($)($)supplier2"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)sapAssociateNumber",
                              "($)($)supplier3"
                            ]
                          }
                        ]
                      },
                      {
                        "($)ne": [
                          "($)schReferenceNumber",
                          "($)($)schReferenceNumber"
                        ]
                      },
                      {
                        "($)ne": [
                          "($)status",
                          "Rejected"
                        ]
                      },
                      {
                        "($)ne": [
                          "($)status",
                          "Cancelled"
                        ]
                      },
                      {
                        "($)ne": [
                          "($)invoiceStatus",
                          "Cancelled"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)poDetails",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)eq": [
                          "($)poDetails.poNumber",
                          "($)($)po"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)poDetails.poItem",
                          "($)($)poitem"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)group": {
                  "_id": {
                    "refNumber": "($)refNumber",
                    "poNumber": "($)poDetails.poNumber",
                    "poItem": "($)poDetails.poItem"
                  },
                  "invoicedValue": {
                    "($)sum": "($)poDetails.invoiceValue"
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "invoicedValue": "($)invoicedValue"
                }
              }
            ],
            "as": "inbd"
          }
        },
        {
          "($)unwind": {
            "path": "($)inbd",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)addFields": {
            "deliveryCharges": {
              "($)round": [
                "($)shipmentGrn2.items.otherCharges.chargAmtLc",
                1
              ]
            }
          }
        },
        {
          "($)match": {
            "shipmentGrn2.deliveryStatus": {
              "($)ne": "Cancelled"
            }
          }
        },
        {
          "($)group": {
            "_id": {
              "poNumber": "($)item.refDocument",
              "poItem": "($)item.refItem",
              "vend1": "($)shipmentGrn2.items.otherCharges.chargVendor",
              "refDocAndItem1": "($)refDocAndItem"
            },
            "materialDescription": {
              "($)first": "($)item.materialDesc"
            },
            "material": {
              "($)first": "($)item.material"
            },
            "refDocAndItem": {
              "($)first": "($)refDocAndItem"
            },
            "deliveryCharges": {
              "($)sum": "($)deliveryCharges"
            },
            "quantity": {
              "($)sum": "($)item.deliveryQty"
            },
            "deliveryQty": {
              "($)sum": "($)shipmentGrn2.items.grnQuantity"
            },
            "uom": {
              "($)first": "($)shipmentGrn2.items.orderUnit"
            },
            "deliveryUOM": {
              "($)first": "($)item.deliveryUOM"
            },
            "chargLocCurr": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargLocCurr"
            },
            "chargCounter": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargCounter"
            },
            "chargStepNum": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargStepNum"
            },
            "chargAmt": {
              "($)sum": "($)shipmentGrn2.items.otherCharges.chargAmtLc"
            },
            "chargVendor": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargVendor"
            },
            "chargContype": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargContype"
            },
            "organisationName": {
              "($)first": "($)vendr.organisationName"
            },
            "mainSupplier": {
              "($)first": {
                "($)concat": [
                  {
                    "($)toString": {
                      "($)toInt": "($)mainSupplier"
                    }
                  },
                  " - ",
                  "($)vendr.organisationName"
                ]
              }
            },
            "unitPrice": {
              "($)first": "($)purchaseDocs.netprice"
            },
            "invoicedValue": {
              "($)first": "($)inbd.invoicedValue"
            }
          }
        },
        {
          "($)addFields": {
            "priceTotal": {
              "($)round": [
                {
                  "($)multiply": [
                    "($)deliveryQty",
                    "($)unitPrice"
                  ]
                },
                2
              ]
            }
          }
        },
        {
          "($)facet": {
            "paginatedResults": [
              {
                "($)sort": {
                  "_id.poNumber": 1,
                  "_id.poItem": 1
                }
              },
              {
                "($)project": {
                  "poNumber": "($)_id.poNumber",
                  "item": {
                    "($)cond": {
                      "if": {
                        "($)eq": [
                          "($)material",
                          ""
                        ]
                      },
                      "then": null,
                      "else": {
                        "($)toInt": "($)material"
                      }
                    }
                  },
                  "invoicedValue": "($)invoicedValue",
                  "deliveryCharges": {
                    "($)ifNull": [
                      "($)deliveryCharges",
                      0
                    ]
                  },
                  "poItem": "($)_id.poItem",
                  "refDocAndItem": "($)refDocAndItem",
                  "materialDescription": "($)materialDescription",
                  "quantity": "($)quantity",
                  "deliveryQty": "($)deliveryQty",
                  "uom": "($)uom",
                  "deliveryUOM": "($)deliveryUOM",
                  "mainSupplier": "($)mainSupplier",
                  "chargAmt": {
                    "($)ifNull": [
                      "($)chargAmt",
                      0
                    ]
                  },
                  "chargVendor": "($)chargVendor",
                  "chargLocCurr": "($)chargLocCurr",
                  "chargCounter": "($)chargCounter",
                  "chargStepNum": "($)chargStepNum",
                  "invoiceFlag": "X",
                  "unitPrice": "($)unitPrice",
                  "chargContype": "($)chargContype",
                  "totalPrice": "($)priceTotal",
                  "percent": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.totalPrice}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)multiply": [
                              {
                                "($)divide": [
                                  "($)priceTotal",
                                  "{{toInt componentSetting.payload.totalPrice}}"
                                ]
                              },
                              100
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "invoiceQty": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": {
                              "($)convert": {
                                "input": "{{componentSetting.payload.invAmount}}",
                                "to": "double",
                                "onError": "string"
                              }
                            }
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)multiply": [
                              {
                                "($)divide": [
                                  {
                                    "($)convert": {
                                      "input": "{{componentSetting.payload.invAmount}}",
                                      "to": "double",
                                      "onError": 1
                                    }
                                  },
                                  {
                                    "($)convert": {
                                      "input": "{{componentSetting.payload.shipmentValue}}",
                                      "to": "double",
                                      "onError": 1
                                    }
                                  }
                                ]
                              },
                              "($)deliveryQty"
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "invoiceValue": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.invAmount}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)multiply": [
                              {
                                "($)divide": [
                                  "($)priceTotal",
                                  "{{toInt componentSetting.payload.totalPrice}}"
                                ]
                              },
                              "{{toInt componentSetting.payload.invAmount}}"
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "balanceValue": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.invAmount}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)subtract": [
                          {
                            "($)cond": {
                              "if": {
                                "($)gt": [
                                  "($)chargAmt",
                                  "{{componentSetting.payload.shipmentValue}}"
                                ]
                              },
                              "then": "{{componentSetting.payload.shipmentValue}}",
                              "else": "($)chargAmt"
                            }
                          },
                          {
                            "($)add": [
                              {
                                "($)multiply": [
                                  {
                                    "($)divide": [
                                      "($)priceTotal",
                                      "{{toInt componentSetting.payload.totalPrice}}"
                                    ]
                                  },
                                  "{{toInt componentSetting.payload.invAmount}}"
                                ]
                              },
                              {
                                "($)ifNull": [
                                  "($)invoicedValue",
                                  0
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      "else": {
                        "($)subtract": [
                          "{{toInt inputParams.shmentValue}}",
                          {
                            "($)ifNull": [
                              "($)invoicedValue",
                              0
                            ]
                          }
                        ]
                      }
                    }
                  },
                  "balanceValue1": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.invAmount}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)subtract": [
                              "($)chargAmt",
                              {
                                "($)multiply": [
                                  {
                                    "($)divide": [
                                      "($)priceTotal",
                                      "{{toInt componentSetting.payload.totalPrice}}"
                                    ]
                                  },
                                  "{{toInt componentSetting.payload.invAmount}}"
                                ]
                              }
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "balanceInvValue": {
                    "($)subtract": [
                      "($)chargAmt",
                      {
                        "($)ifNull": [
                          "($)invoicedValue",
                          0
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)sort": {
                  "{{componentSetting.matSortActive}}": "{{componentSetting.matSortDirection}}"
                }
              }
            ],
            "totalCount": [
              {
                "($)count": "count"
              }
            ]
          }
        }
      ]
    },
    {
      "role": [
        "ES-SPECIFIC-INB-DBS"
      ],
      "value": [
        {
          "($)match": {
            "($)or": [
              {
                "externalDeliveryID": {
                  "($)in": [
                    "{{inputParams['selectedRows']['refNumber']['0']}}",
                    "{{toString inputParams.refNumber}}"
                  ]
                }
              },
              {
                "shipmentNumber": {
                  "($)in": [
                    "{{inputParams['selectedRows']['shipmentNumber']['0']}}",
                    "{{toString inputParams.shipmentNumber}}"
                  ]
                }
              }
            ],
            "shipmentType": "Z030"
          }
        },
        {
          "($)lookup": {
            "from": "vendors",
            "let": {
              "mainSupplier": "($)mainSupplier"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)eq": [
                          "($)sapAssociateNumber",
                          "($)($)mainSupplier"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)active",
                          true
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "organisationName": 1,
                  "sapAssociateNumber": 1,
                  "userId": 1,
                  "active": 1,
                  "status": 1,
                  "userIds": 1,
                  "bankDetails": 1,
                  "contactDetails": 1
                }
              }
            ],
            "as": "vendr"
          }
        },
        {
          "($)unwind": {
            "path": "($)vendr",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)unwind": {
            "path": "($)item",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)addFields": {
            "vend1": "{{inputParams['selectedRows']['Partner']['0']}}",
            "vend2": "{{inputParams.servicePartnerNumber}}",
            "refDocAndItem": {
              "($)concat": [
                "($)item.refDocument",
                {
                  "($)concat": [
                    {
                      "($)substr": [
                        "000",
                        0,
                        {
                          "($)subtract": [
                            3,
                            {
                              "($)strLenCP": {
                                "($)toString": "($)item.refItem"
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "($)toString": "($)item.refItem"
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "($)lookup": {
            "from": "DespatchDocs",
            "let": {
              "item2": "($)item.refDocument",
              "item1": "($)item.refItem",
              "vendr3": "($)vend1",
              "vendr2": "($)vend2",
              "delNo": "($)externalDeliveryID",
              "deliveryNumber": "($)deliveryNumber",
              "deliveryItem": "($)item.itemNumber"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)in": [
                      "($)($)delNo",
                      {
                        "($)ifNull": [
                          "($)items.inboundExtref",
                          []
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)match": {
                  "deliveryStatus": {
                    "($)ne": "Cancelled"
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)items",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)ne": [
                          "($)items.deliveryStatus_i",
                          "QA Reject"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.inboundDelNo",
                          "($)($)deliveryNumber"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.inboundDelItem",
                          "($)($)deliveryItem"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.inboundExtref",
                          "($)($)delNo"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)items.otherCharges",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)eq": [
                          "($)items.otherCharges.chargPurDoc",
                          "($)($)item2"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)items.otherCharges.chargItem",
                          "($)($)item1"
                        ]
                      },
                      {
                        "($)or": [
                          {
                            "($)eq": [
                              "($)items.otherCharges.chargVendor",
                              "($)($)vendr3"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)items.otherCharges.chargVendor",
                              "($)($)vendr2"
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "items": 1,
                  "deliveryStatus": 1
                }
              }
            ],
            "as": "shipmentGrn2"
          }
        },
        {
          "($)unwind": {
            "path": "($)shipmentGrn2",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)unwind": {
            "path": "($)shipmentGrn2.items",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)unwind": {
            "path": "($)shipmentGrn2.items.otherCharges",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)addFields": {
            "deliveryCharges": {
              "($)round": [
                "($)shipmentGrn2.items.otherCharges.chargAmtLc",
                1
              ]
            }
          }
        },
        {
          "($)lookup": {
            "from": "PurchaseDocs",
            "let": {
              "po": "($)item.refDocument",
              "poitem": "($)item.refItem"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)eq": [
                      "($)purchasingDocumentNr",
                      "($)($)po"
                    ]
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)item",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)eq": [
                      "($)item.purchaseDocumentItem",
                      "($)($)poitem"
                    ]
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "netprice": "($)item.netPrice"
                }
              }
            ],
            "as": "purchaseDocs"
          }
        },
        {
          "($)unwind": {
            "path": "($)purchaseDocs",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)addFields": {
            "shipmentNum": {
              "($)replaceOne": {
                "input": "($)shipmentNumber",
                "find": "^0+",
                "replacement": ""
              }
            }
          }
        },
        {
          "($)lookup": {
            "from": "InboundShipment",
            "let": {
              "shipmentNumber": "($)shipmentNum",
              "po": "($)item.refDocument",
              "poitem": "($)item.refItem",
              "delNo": "($)externalDeliveryID",
              "supplier": "{{toInt inputParams['selectedRows']['Partner']['0']}}",
              "supplier2": "{{toInt inputParams.servicePartnerNumber}}",
              "schReferenceNumber": "{{inputParams.schReferenceNumber}}"
            },
            "pipeline": [
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)or": [
                          {
                            "($)eq": [
                              "($)refNumber",
                              "($)($)delNo"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)shipmentNumber",
                              "($)($)shipmentNumber"
                            ]
                          }
                        ]
                      },
                      {
                        "($)or": [
                          {
                            "($)eq": [
                              "($)sapAssociateNumber",
                              "($)($)supplier"
                            ]
                          },
                          {
                            "($)eq": [
                              "($)sapAssociateNumber",
                              "($)($)supplier2"
                            ]
                          }
                        ]
                      },
                      {
                        "($)ne": [
                          "($)schReferenceNumber",
                          "($)($)schReferenceNumber"
                        ]
                      },
                      {
                        "($)ne": [
                          "($)status",
                          "Rejected"
                        ]
                      },
                      {
                        "($)ne": [
                          "($)status",
                          "Cancelled"
                        ]
                      },
                      {
                        "($)ne": [
                          "($)invoiceStatus",
                          "Cancelled"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)unwind": {
                  "path": "($)poDetails",
                  "preserveNullAndEmptyArrays": true
                }
              },
              {
                "($)match": {
                  "($)expr": {
                    "($)and": [
                      {
                        "($)eq": [
                          "($)poDetails.poNumber",
                          "($)($)po"
                        ]
                      },
                      {
                        "($)eq": [
                          "($)poDetails.poItem",
                          "($)($)poitem"
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "($)group": {
                  "_id": {
                    "refNumber": "($)refNumber",
                    "poNumber": "($)poDetails.poNumber",
                    "poItem": "($)poDetails.poItem"
                  },
                  "invoicedValue": {
                    "($)sum": "($)poDetails.invoiceValue"
                  }
                }
              },
              {
                "($)project": {
                  "_id": 0,
                  "invoicedValue": "($)invoicedValue"
                }
              }
            ],
            "as": "inbd"
          }
        },
        {
          "($)unwind": {
            "path": "($)inbd",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "($)match": {
            "shipmentGrn2.deliveryStatus": {
              "($)ne": "Cancelled"
            }
          }
        },
        {
          "($)group": {
            "_id": {
              "shipmentNumber": "($)shipmentNumber",
              "poNumber": "($)item.refDocument",
              "poItem": "($)item.refItem",
              "vend1": "($)shipmentGrn2.items.otherCharges.chargVendor"
            },
            "materialDescription": {
              "($)first": "($)item.materialDesc"
            },
            "material": {
              "($)first": "($)item.material"
            },
            "unitPrice": {
              "($)first": "($)purchaseDocs.netprice"
            },
            "refDocAndItem": {
              "($)first": "($)refDocAndItem"
            },
            "deliveryCharges": {
              "($)sum": "($)deliveryCharges"
            },
            "quantity": {
              "($)sum": "($)item.deliveryQty"
            },
            "deliveryQty": {
              "($)sum": "($)shipmentGrn2.items.grnQuantity"
            },
            "uom": {
              "($)first": "($)shipmentGrn2.items.orderUnit"
            },
            "deliveryUOM": {
              "($)first": "($)item.deliveryUOM"
            },
            "chargLocCurr": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargLocCurr"
            },
            "chargCounter": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargCounter"
            },
            "chargStepNum": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargStepNum"
            },
            "chargAmt": {
              "($)sum": "($)shipmentGrn2.items.otherCharges.chargAmtLc"
            },
            "chargVendor": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargVendor"
            },
            "chargContype": {
              "($)first": "($)shipmentGrn2.items.otherCharges.chargContype"
            },
            "organisationName": {
              "($)first": "($)vendr.organisationName"
            },
            "mainSupplier": {
              "($)first": {
                "($)concat": [
                  {
                    "($)toString": {
                      "($)toInt": "($)mainSupplier"
                    }
                  },
                  " - ",
                  "($)vendr.organisationName"
                ]
              }
            },
            "invoicedValue": {
              "($)first": "($)inbd.invoicedValue"
            }
          }
        },
        {
          "($)addFields": {
            "priceTotal": {
              "($)round": [
                {
                  "($)multiply": [
                    "($)deliveryQty",
                    "($)unitPrice"
                  ]
                },
                2
              ]
            }
          }
        },
        {
          "($)facet": {
            "paginatedResults": [
              {
                "($)sort": {
                  "_id.poNumber": 1,
                  "_id.poItem": 1
                }
              },
              {
                "($)project": {
                  "poNumber": "($)_id.poNumber",
                  "deliveryCharges": "($)deliveryCharges",
                  "item": {
                    "($)cond": {
                      "if": {
                        "($)eq": [
                          "($)material",
                          ""
                        ]
                      },
                      "then": null,
                      "else": {
                        "($)toInt": "($)material"
                      }
                    }
                  },
                  "poItem": "($)_id.poItem",
                  "refDocAndItem": "($)refDocAndItem",
                  "materialDescription": "($)materialDescription",
                  "quantity": "($)quantity",
                  "deliveryQty": "($)deliveryQty",
                  "uom": "($)uom",
                  "deliveryUOM": "($)deliveryUOM",
                  "mainSupplier": "($)mainSupplier",
                  "chargAmt": "($)chargAmt",
                  "chargContype": "($)chargContype",
                  "totalPrice": "($)priceTotal",
                  "invoicedValue": "($)invoicedValue",
                  "percent": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.totalPrice}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)multiply": [
                              {
                                "($)divide": [
                                  "($)priceTotal",
                                  "{{toInt componentSetting.payload.totalPrice}}"
                                ]
                              },
                              100
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "invoiceQty": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": {
                              "($)convert": {
                                "input": "{{componentSetting.payload.invAmount}}",
                                "to": "double",
                                "onError": "string"
                              }
                            }
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)multiply": [
                              {
                                "($)divide": [
                                  {
                                    "($)convert": {
                                      "input": "{{componentSetting.payload.invAmount}}",
                                      "to": "double",
                                      "onError": 1
                                    }
                                  },
                                  {
                                    "($)convert": {
                                      "input": "{{componentSetting.payload.shipmentValue}}",
                                      "to": "double",
                                      "onError": 1
                                    }
                                  }
                                ]
                              },
                              "($)deliveryQty"
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "invoiceValue": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.invAmount}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)multiply": [
                              {
                                "($)divide": [
                                  "($)priceTotal",
                                  "{{toInt componentSetting.payload.totalPrice}}"
                                ]
                              },
                              "{{toInt componentSetting.payload.invAmount}}"
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "balanceValue": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.invAmount}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)subtract": [
                          {
                            "($)cond": {
                              "if": {
                                "($)gt": [
                                  "($)chargAmt",
                                  "{{componentSetting.payload.shipmentValue}}"
                                ]
                              },
                              "then": "{{componentSetting.payload.shipmentValue}}",
                              "else": "($)chargAmt"
                            }
                          },
                          {
                            "($)add": [
                              {
                                "($)multiply": [
                                  {
                                    "($)divide": [
                                      "($)priceTotal",
                                      "{{toInt componentSetting.payload.totalPrice}}"
                                    ]
                                  },
                                  "{{toInt componentSetting.payload.invAmount}}"
                                ]
                              },
                              {
                                "($)ifNull": [
                                  "($)invoicedValue",
                                  0
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      "else": {
                        "($)subtract": [
                          {
                            "($)cond": {
                              "if": {
                                "($)in": [
                                  {
                                    "($)type": "{{toInt inputParams['selectedRows']['shmentValue']['0']}}"
                                  },
                                  [
                                    "int",
                                    "double"
                                  ]
                                ]
                              },
                              "then": "{{toInt inputParams['selectedRows']['shmentValue']['0']}}",
                              "else": {
                                "($)cond": {
                                  "if": {
                                    "($)in": [
                                      {
                                        "($)type": "{{toInt inputParams.shmentValue}}"
                                      },
                                      [
                                        "int",
                                        "double"
                                      ]
                                    ]
                                  },
                                  "then": "{{toInt inputParams.shmentValue}}",
                                  "else": 0
                                }
                              }
                            }
                          },
                          {
                            "($)ifNull": [
                              "($)invoicedValue",
                              0
                            ]
                          }
                        ]
                      }
                    }
                  },
                  "balanceValue1": {
                    "($)cond": {
                      "if": {
                        "($)in": [
                          {
                            "($)type": "{{toInt componentSetting.payload.invAmount}}"
                          },
                          [
                            "int",
                            "double"
                          ]
                        ]
                      },
                      "then": {
                        "($)round": [
                          {
                            "($)subtract": [
                              "($)chargAmt",
                              {
                                "($)multiply": [
                                  {
                                    "($)divide": [
                                      "($)priceTotal",
                                      "{{toInt componentSetting.payload.totalPrice}}"
                                    ]
                                  },
                                  "{{toInt componentSetting.payload.invAmount}}"
                                ]
                              }
                            ]
                          },
                          3
                        ]
                      },
                      "else": null
                    }
                  },
                  "balanceInvValue": {
                    "($)subtract": [
                      "($)chargAmt",
                      {
                        "($)ifNull": [
                          "($)invoicedValue",
                          0
                        ]
                      }
                    ]
                  },
                  "chargVendor": "($)chargVendor",
                  "chargLocCurr": "($)chargLocCurr",
                  "chargCounter": "($)chargCounter",
                  "chargStepNum": "($)chargStepNum",
                  "invoiceFlag": "X",
                  "unitPrice": "($)unitPrice"
                }
              },
              {
                "($)sort": {
                  "{{componentSetting.matSortActive}}": "{{componentSetting.matSortDirection}}"
                }
              }
            ],
            "totalCount": [
              {
                "($)count": "count"
              }
            ]
          }
        }
      ]
    }
  ]`;

const template = Handlebars.compile(aggregationTemplate);
const renderedString = template(payload);

console.log("Rendered Aggregation Pipeline:", renderedString);