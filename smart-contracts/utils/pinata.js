"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinataClient = void 0;
var pinataSDK = require("@pinata/sdk");
var fs = require("fs");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var PinataClient = /** @class */ (function () {
    function PinataClient() {
        var apiKey = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY;
        var apiSecret = process.env.PINATA_API_SECRET || process.env.NEXT_PUBLIC_PINATA_API_SECRET;
        if (!apiKey || !apiSecret) {
            throw new Error('Pinata API credentials not found in environment variables');
        }
        // Initialize with JWT if available, fallback to API key/secret
        var jwt = process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;
        if (jwt) {
            this.pinata = pinataSDK({ pinataJWTKey: jwt });
        }
        else {
            this.pinata = pinataSDK(apiKey, apiSecret);
        }
    }
    PinataClient.getInstance = function () {
        if (!PinataClient.instance) {
            PinataClient.instance = new PinataClient();
        }
        return PinataClient.instance;
    };
    PinataClient.prototype.testAuthentication = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pinata.testAuthentication()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Authentication Error:', error_1);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PinataClient.prototype.pinFileToIPFS = function (filePath_1) {
        return __awaiter(this, arguments, void 0, function (filePath, options) {
            var readableStreamForFile, metadata, result, error_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        readableStreamForFile = fs.createReadStream(filePath);
                        metadata = {
                            name: "BrickEarn-".concat(Date.now()),
                            keyvalues: __assign({}, options.metadata)
                        };
                        return [4 /*yield*/, this.pinata.pinFileToIPFS(readableStreamForFile, {
                                pinataMetadata: metadata
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error uploading to IPFS:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PinataClient.prototype.pinJSONToIPFS = function (jsonBody_1) {
        return __awaiter(this, arguments, void 0, function (jsonBody, options) {
            var metadata, result, error_3;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        metadata = {
                            name: "BrickEarn-".concat(Date.now()),
                            keyvalues: __assign({}, options.metadata)
                        };
                        return [4 /*yield*/, this.pinata.pinJSONToIPFS(jsonBody, {
                                pinataMetadata: metadata
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error uploading JSON to IPFS:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PinataClient.prototype.getIPFSGatewayURL = function (hash) {
        var gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
        return "".concat(gateway, "/").concat(hash);
    };
    return PinataClient;
}());
exports.PinataClient = PinataClient;
