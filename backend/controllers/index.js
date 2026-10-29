const AuthController = require('./AuthController');
const DepartmentController = require('./departmentController');
const sendMail = require('./sendMail');
const LocationController = require('./LocationController');
const satelliteImageController = require('./satelliteImageController');
const SectorController = require('./SectorController');
const QuarterController = require('./QuarterController');
const userController = require('./userController');
const homeController = require('./homeController');
const applicationController = require('./applicationController');
const certificateController = require('./certificateController');
const quarterAllotmentController = require('./quarterAllotmentController');
const encroachmentController = require('./encroachmentController');
const repairMaintainController = require('./repairMaintainController');
const courtCasesController = require('./courtCasesController');
const sendOTP = require('./sendOTP');

module.exports = {
	AuthController,
	DepartmentController,
	sendMail,
	LocationController,
	satelliteImageController,
	SectorController,
	QuarterController,
	userController,
	homeController,
	applicationController,
	certificateController,
	quarterAllotmentController,
	encroachmentController,
	repairMaintainController,
	courtCasesController,
	sendOTP
};
