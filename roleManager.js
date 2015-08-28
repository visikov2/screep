module.exports = {
	roleExists: function(role){
		try
		{
			require("roles_" + role);
			return true;
		}
		catch(e)
		{
			return false;
		}
	},

	getRole: function(role)
	{
		if(!this.roleExists(role)) {
			return false;
		}

        var proto = require('role_prototype');

		var roleObject = require("roles_" + role);
        roleObject = require('extend')(roleObject, proto);
		return roleObject;
	},

	getRoleBodyParts: function(role, room)
	{
		if(!this.roleExists(role)) {
			return false;
		}

		role = this.getRole(role);

		if(role.getParts !== undefined) {
			return role.getParts(room);
		}
		else {
			return role.prototype.getParts(room);
		}
	}
};