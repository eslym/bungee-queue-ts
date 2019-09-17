"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var herobrine = {
    name: "Herobrine",
    uuid: "f84c6a79-0a4e-45e0-879b-cd49ebd4c4e2"
};
var FileBasedPermissionManager = (function () {
    function FileBasedPermissionManager(groupPath, permissionPath) {
        this.nameGroupIndex = new Map();
        this.uuidGroupIndex = new Map();
        this.nameIndex = new Map();
        this.uuidIndex = new Map();
        this.groupPath = groupPath;
        this.permissionPath = permissionPath;
        this.groups = this.loadGroups();
        this.permissions = this.loadPermissions();
        this.buildIndices();
    }
    FileBasedPermissionManager.prototype.addPermission = function (player, permission) {
        return this;
    };
    FileBasedPermissionManager.prototype.groupAddMember = function (group, member) {
        return this;
    };
    FileBasedPermissionManager.prototype.groupPermissionAdd = function (group, permission) {
        return this;
    };
    FileBasedPermissionManager.prototype.groupPermissionRemove = function (group, permission) {
        return this;
    };
    FileBasedPermissionManager.prototype.groupRemoveMember = function (group, member) {
        return this;
    };
    FileBasedPermissionManager.prototype.removePermission = function (player, permission) {
        return this;
    };
    FileBasedPermissionManager.prototype.setQueueService = function (service) {
        this.service = service;
        return this;
    };
    FileBasedPermissionManager.prototype.hasPermission = function (client, permission) {
        return false;
    };
    FileBasedPermissionManager.prototype.getService = function () {
        return this.service;
    };
    FileBasedPermissionManager.prototype.loadGroups = function () {
        if (fs.existsSync(this.groupPath)) {
            return JSON.parse(fs.readFileSync(this.groupPath).toString('utf8'));
        }
        else {
            var groups = {
                "admin": {
                    permissions: [
                        "queue.list",
                        "queue.prioritize"
                    ],
                    members: [herobrine]
                }
            };
            fs.writeFile(this.groupPath, JSON.stringify(groups, null, 2), function () { });
            return groups;
        }
    };
    FileBasedPermissionManager.prototype.loadPermissions = function () {
        if (fs.existsSync(this.permissionPath)) {
            return JSON.parse(fs.readFileSync(this.permissionPath).toString('utf8'));
        }
        else {
            var permissions = [{
                    name: herobrine.name,
                    uuid: herobrine.uuid,
                    permissions: []
                }];
            fs.writeFile(this.permissionPath, JSON.stringify(permissions, null, 2), function () { });
            return permissions;
        }
    };
    FileBasedPermissionManager.prototype.buildIndices = function () {
        var _this = this;
        Object.entries(this.groups).forEach(function (pairs) {
            pairs[1].members.forEach(function (member) {
                if (!_this.nameGroupIndex.has(member.name)) {
                    _this.nameGroupIndex.set(member.name, []);
                }
                _this.nameGroupIndex.get(member.name).push(pairs[0]);
                if ((member.hasOwnProperty('uuid'))) {
                    if (!_this.uuidGroupIndex.has(member.uuid)) {
                        _this.uuidGroupIndex.set(member.uuid, []);
                    }
                    _this.uuidGroupIndex.get(member.uuid).push(pairs[0]);
                }
            });
        });
        this.permissions.forEach(function (player) {
            _this.nameIndex.set(player.name, player);
            if (player.hasOwnProperty('uuid')) {
                _this.uuidIndex.set(player.uuid, player);
            }
        });
    };
    return FileBasedPermissionManager;
}());
exports.FileBasedPermissionManager = FileBasedPermissionManager;
//# sourceMappingURL=FileBasedPermissionManager.js.map