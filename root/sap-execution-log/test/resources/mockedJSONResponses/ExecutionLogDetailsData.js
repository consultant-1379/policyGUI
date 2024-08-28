/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 */
if (typeof define !== 'function') {
    var define = require('../../../../node_modules/amdefine')(module);
}

define(function () {

    /**
     * simulated response from /sd/v1.0/logs
     * (will scale this up to test pagination)
     */

    return {
                rawMessageInput: {
                    ApnName: {
                    default: "apn.operator.com",
                    description: "Access Point Name (APN) for GGSN/PDN Gateway ",
                    type: "string"
                    },
                    ChargingEnabled: {
                    default: false,
                    description: "Charging ",
                    type: "boolean"
                    },
                    DC_Location: {
                    default: [
                              "Athlone",
                              "Gothenburg"
                              ],
                              description: "Location of virtual Data Centre (vDC) ",
                              type: "string"
                    },
                    GiAddressRange: {
                    default: "10.10.1.0/29",
                    description: "DHCP Pool independent Gi Address (GGSN-to-PDN) ",
                    type: "string"
                    },
                    GiVpnId: {
                    default: 22,
                    description: "Gi (GGSN-to-PDN) VPN ID ",
                    type: "integer"
                    },
                    ImsiNumberSeries: {
                    default: "272-01",
                    description: "International Mobile Subscriber Identity ",
                    type: "string"
                    },
                    RoamingEnabled: {
                    default: false,
                    description: "Roaming ",
                    type: "boolean"
                    },
                    VNFM_Host: {
                    default: "http://141.137.212.33:8081",
                    description: "VNFManager Host IP, http://<IPv4 address>:<Port> ",
                    type: "string"
                    },
                    vEPG_VIM: {
                    default: "CEE",
                    description: "Vimzone for vMME Node in the slice ",
                    type: "string"
                    },
                    vMME_VIM: {
                    default: "CEE",
                    description: "Vimzone for vMME Node in the slice ",
                    type: "string"
                    },
                    vPCRF_VIM: {
                    default: "myVzId",
                    description: "Vimzone for vMME Node in the slice ",
                    type: "string"
                    }
                },
                rawMessageOutput: {

                    pgwInterfaces: {
                        "default.vrf": {
                            "Gi - if": {
                                addresses: [
                                            "29.135.0.0/18"
                                            ],
                                            gateway: "29.135.0.1/18",
                                            subnet: "29.135.0.0/18"
                            },
                            "gns5s8 - c - if": {
                                addresses: [
                                            "10.51.161.57/29"
                                            ],
                                            gateway: "10.51.161.57/29",
                                            subnet: "10.51.161.56/29"
                            },
                            "gns5s8 - u - if": {
                                addresses: [
                                            "10.51.161.65/29"
                                            ],
                                            gateway: "10.51.161.65/29",
                                            subnet: "10.51.161.64/29"
                            },
                            "gom - c - if": {
                                addresses: [
                                            "10.51.161.73/29"
                                            ],
                                            gateway: "10.51.161.73/29",
                                            subnet: "10.51.161.72/29"
                            },
                            "s1s4s12 - u - if": {
                                addresses: [
                                            "10.51.161.49/29"
                                            ],
                                            gateway: "10.51.161.49/29",
                                            subnet: "10.51.161.48/29"
                            },
                            "s4s11 - c - if": {
                                addresses: [
                                            "10.51.161.25/29"
                                             ],
                                            gateway: "10.51.161.25/29",
                                            subnet: "10.51.161.24/29"
                            },
                            "s5s8 - c - if": {
                                addresses: [
                                            "10.51.161.33/29"
                                            ],
                                            gateway: "10.51.161.33/29",
                                            subnet: "10.51.161.32/29"
                            },
                            "s5s8 - u - if": {
                                addresses: [
                                            "10.51.161.41/29"
                                            ],
                                            gateway: "10.51.161.41/29",
                                            subnet: "10.51.161.40/29"
                            },
                            vLC: {
                                addresses: [
                                            "10.51.161.2/29"
                                            ],
                                            gateway: "10.51.161.1/29",
                                            subnet: "10.51.161.0/29"
                            }
                        },
                        "oam.vpn": {
                            EpgMgmt: {
                                addresses: [
                                            "10.51.161.10/29"
                                            ],
                                            gateway: "10.51.161.9/29",
                                            subnet: "10.51.161.8/29"
                            }
                        }
                    },
                    pgwRoutingConfig: " unconfigure vlan #VLC-1_EXT-1_vlanID ipaddress; configure vlan #VLC-1_EXT-1_vlanID ipaddress 1.1.1.1"
                },
                notes: {
                    error: "ERROR: validation error here...",
                    filtered: {
                        "assetType": "VM",
                        "eventType": "PM",
                        "previousAction": "restart VM",
                        "subsequentActionWaitTime": "2017-04-21 18:25:43 05:00",
                        "previousAssetActionTime": "2017-04-21 18:25:43 05:00",
                        "other": "aaa a aaa a a a a"
                    },
                    failed: "FAILED: no applicable decision rule was found msg..."
                }
            }
});
