const { sendMail, LocationController, SectorController, QuarterController, userController, homeController, applicationController, certificateController, quarterAllotmentController, encroachmentController, repairMaintainController, courtCasesController, sendOTP, satelliteImageController} = require('../controllers');
const departmentController = require('../controllers/departmentController');

const AuthController = require('../controllers').AuthController;
const authMiddleware = require('../middleware/authMiddleware');

//Api's
module.exports = (app) => {
	app.get('/api', (req, res) =>
		res.status(200).send({
			message: 'Welcome'
		})
	);

	//Authentication
	app.post('/api/authenticate', AuthController.authenticate);

	//Verify JWT token & 15-day validity
	app.get('/api/verifyToken', authMiddleware.verifyToken, (req, res) => {
		res.status(200).send({
			status: true,
			message: 'Token is valid',
			user: req.user
		});
	});


	//user
	app.post('/api/createUser', userController.createUser);
	
	app.post('/api/uploadAnx', userController.upload_config.single('file'), userController.uploadAnx);

	app.post('/api/uploadPan', userController.upload_config.single('file'), userController.uploadPan);

	app.post('/api/uploadAdhar', userController.upload_config.single('file'), userController.uploadAdhar);

	app.post('/api/uploadPhoto', userController.upload_config.single('file'), userController.uploadPhoto);

	app.post('/api/uploadSign', userController.upload_config.single('file'), userController.uploadSign);

	app.post('/api/uploadIcard', userController.upload_config.single('file'), userController.uploadIcard);

	app.post('/api/uploadAppointment', userController.upload_config.single('file'), userController.uploadAppointment);

	app.post('/api/userDetails', userController.userDetails);

	
	//department
	app.get('/api/department', departmentController.getDepartment);

	app.post('/api/addDepartment', departmentController.addDepartment);
	
	app.post('/api/updateDept', departmentController.updateDept);

	
	//profile
	app.post('/api/updateUserData', userController.updateUserData);
	



	//user
	// app.post('/api/createUser', AuthController.createUser);

	//email and mobile verification for login
	app.post('/api/sendOtp', sendMail.sendOtp);

	//email and mobile verification for signup
	app.post('/api/verifyEmail', AuthController.verifyEmail);

	app.post('/api/sendEmailOtp', sendOTP.sendEmailOtp);


	app.post('/api/verifyPhone', AuthController.verifyPhone);

	app.post('/api/sendMobileOtp', sendOTP.sendMobileOtp);

	app.post('/api/verifyAadhaar', AuthController.verifyAadhaar);


	//location
	app.get('/api/getLocation', LocationController.getLocation);

	app.post('/api/addLocation', LocationController.addLocation);

	app.post('/api/updateLocation', LocationController.updateLocation);


	//sector
	app.get('/api/getSector', SectorController.getSector);

	app.post('/api/addSector', SectorController.addSector);

	app.post('/api/updateSector', SectorController.updateSector);

	app.get('/api/getSectorData/:req', SectorController.getSectorData);

	// Satellite images (admin only)
	app.get('/api/satellite-images', satelliteImageController.list);
	app.get('/api/satellite-images/:recordId/:filename', satelliteImageController.file);
	app.post('/api/satellite-images', satelliteImageController.upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }]), satelliteImageController.uploadError, satelliteImageController.save);
	app.delete('/api/satellite-images/:recordId', satelliteImageController.remove);


	//quarter
	app.get('/api/getQuarter', QuarterController.getQuarter);

	// app.post('/api/addQuarter', QuarterController.addQuarter);

	app.post('/api/addQuarter', QuarterController.upload_config.single('file'), QuarterController.addQuarter);

	app.post('/api/updateQuarter', QuarterController.updateQuarter);

	app.get('/api/checkQuarter/:req', QuarterController.checkQuarter);

	app.post('/api/deleteQuarter', QuarterController.deleteQuarter);

	app.post('/api/quarterDeleteRequests', QuarterController.getQuarterDeleteRequests);

	app.post('/api/reviewQuarterDeleteRequest', QuarterController.reviewQuarterDeleteRequest);

	app.post('/api/updateQuarterRequest', userController.updateQuarterRequest);

	app.post('/api/updateQuarterData', QuarterController.updateQuarterData);

	app.post('/api/updateQuarterAllotment', quarterAllotmentController.updateQuarterAllotment);

	app.post('/api/updatePhoto2', QuarterController.upload_config.single('file'), QuarterController.updatePhoto2);

	// app.post('/api/updatePhoto2', QuarterController.upload_config.single('file'), QuarterController.updatePhoto2);

	// app.post('/api/updatePhoto3', QuarterController.upload_config.single('file'), QuarterController.updatePhoto3);

	// app.post('/api/updatePhoto4', QuarterController.upload_config.single('file'), QuarterController.updatePhoto4);

	//court cases

	app.post('/api/createCourtCase', courtCasesController.createCourtCase);
	
	app.post('/api/updateCourtCase', courtCasesController.updateCourtCase);

	app.post('/api/uploadCourtCase', courtCasesController.upload_config.single('file'), courtCasesController.uploadCourtCase);

	app.get('/api/getCaseData', courtCasesController.getCaseData);

	app.post('/api/deleteCourtCase', courtCasesController.deleteCourtCase);


	//home
	app.get('/api/adminHomeCounter', homeController.adminHomeCounter);

	app.post('/api/userHomeCounter', homeController.userHomeCounter);


	// Fresh Quarter apply
	app.post('/api/applyQuarter', userController.upload_config.single('file'), applicationController.applyQuarter);

	app.post('/api/checkUser', applicationController.checkUser);

	app.get('/api/applyData', applicationController.applyData);

	app.get('/api/freshApplyData/:rqstId', applicationController.freshApplyData);

	app.post('/api/acceptFreshQuarter', applicationController.acceptFreshQuarter);

	app.post('/api/rejectFreshQuarter', applicationController.rejectFreshQuarter);

	app.post('/api/verifiedFreshQuarter', applicationController.verifiedFreshQuarter);

	app.get('/api/quarterAllocationCount', applicationController.quarterAllocationCount);

	app.post('/api/allotedFreshQuarter', applicationController.allotedFreshQuarter);

	app.get('/api/getApproveFreshData', applicationController.getApproveFreshData);

	app.post('/api/updateFreshQuarter', applicationController.updateFreshQuarter);

	app.post('/api/updateQuarterAllotedPhoto', applicationController.upload_config.single('file'), applicationController.updateQuarterAllotedPhoto);

	


	//apply certificate
	app.post('/api/addNocPermission', certificateController.upload_config.single('file'), certificateController.addNocPermission);
	
	app.post('/api/nocPromotionData', certificateController.nocPromotionData);
	
	app.get('/api/nocPromotionCount', certificateController.nocPromotionCount);

	app.get('/api/noAccomodationCount', certificateController.noAccomodationCount);

	


	app.post('/api/addNoAccomodation', certificateController.upload_config.single('file'), certificateController.addNoAccomodation);

	app.post('/api/noAccomodationData', certificateController.noAccomodationData);

	app.get('/api/getNonAccoData', certificateController.getNonAccoData);

	app.post('/api/acceptNoAcco', certificateController.acceptNoAcco);

	app.post('/api/rejectNoAcco', certificateController.rejectNoAcco);



	app.get('/api/getNocPromotionData', certificateController.getNocPromotionData);


	//apply renewal
	app.post('/api/quarterRenewalApply', quarterAllotmentController.quarterRenewalApply);
	
	app.post('/api/quarterApplyDetails', quarterAllotmentController.quarterApplyDetails);

	app.post('/api/uploadOrderFile', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadOrderFile);

	app.post('/api/uploadSideOneImage', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadSideOneImage);

	app.post('/api/uploadSideTwoImage', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadSideTwoImage);

	app.post('/api/uploadSideThreeImage', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadSideThreeImage);

	app.post('/api/uploadSideFourImage', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadSideFourImage);

	app.post('/api/uploadQtrExtndImage', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadQtrExtndImage);

	app.post('/api/saveFinalForm', quarterAllotmentController.saveFinalForm);

	app.get('/api/renewalApplyData/:rqstId', quarterAllotmentController.renewalApplyData);

	app.get('/api/renewalApplyList', quarterAllotmentController.renewalApplyList);

	app.post('/api/acceptQuarterRenewal', quarterAllotmentController.acceptQuarterRenewal);

	app.post('/api/rejectQuarterRenewal', quarterAllotmentController.rejectQuarterRenewal);

	app.get('/api/quarterRenewalCount', quarterAllotmentController.quarterRenewalCount);

	app.post('/api/uploadSignedCopy', quarterAllotmentController.upload_config.single('file'), quarterAllotmentController.uploadSignedCopy);

	app.get('/api/renewalApprovedList', quarterAllotmentController.renewalApprovedList);

	app.post('/api/updateQuarterForm', quarterAllotmentController.updateQuarterForm);
	

	// Encroachment
	app.post('/api/addEncroachment', encroachmentController.addEncroachment);

	app.post('/api/uploadEncImgOne', encroachmentController.upload_config.single('file'), encroachmentController.uploadEncImgOne);

	app.post('/api/uploadEncImgTwo', encroachmentController.upload_config.single('file'), encroachmentController.uploadEncImgTwo);

	app.post('/api/uploadEncImgThree', encroachmentController.upload_config.single('file'), encroachmentController.uploadEncImgThree);

	app.post('/api/uploadEncImgFour', encroachmentController.upload_config.single('file'), encroachmentController.uploadEncImgFour);

	app.post('/api/uploadEncImgFive', encroachmentController.upload_config.single('file'), encroachmentController.uploadEncImgFive);

	app.get('/api/encroachData', encroachmentController.encroachData);

	app.post('/api/updateEncroach', encroachmentController.updateEncroach);

	app.post('/api/updateEncroachWithPhotos', encroachmentController.upload_config.single('file'), encroachmentController.updateEncroachWithPhotos);

	app.post('/api/deleteEncroach', encroachmentController.deleteEncroach);

	app.post('/api/encroachmentDeleteRequests', encroachmentController.getEncroachmentDeleteRequests);

	app.post('/api/reviewEncroachmentDeleteRequest', encroachmentController.reviewEncroachmentDeleteRequest);


	// Repair and maintanace 

	app.get('/api/RepairList', repairMaintainController.RepairList);

	app.post('/api/checkRepairData', repairMaintainController.checkRepairData);

	app.post('/api/uploadAllotment', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadAllotment);

	app.post('/api/uploadDoor', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadDoor);
	
	app.post('/api/uploadWindow', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadWindow);

	app.post('/api/uploadWall', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadWall);

	app.post('/api/uploadCeiling', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadCeiling);

	app.post('/api/uploadWiring', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadWiring);

	app.post('/api/uploadTank', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadTank);

	app.post('/api/uploadRoof', repairMaintainController.upload_config.single('file'), repairMaintainController.uploadRoof);

	};
