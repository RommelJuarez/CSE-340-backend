// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// management routes
router.get("/",utilities.checkAccountType ,invController.buildManagement);
// Route to build add-classification view
router.get("/add-classification",utilities.checkAccountType, invController.buildAddClassification);
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by inventory detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Add Classification 
router.post("/add-classification",utilities.checkAccountType,regValidate.classificationRules(),regValidate.checkClassificationData,invController.addClassification);
// Add Inventory form 
router.get("/add-inventory",utilities.checkAccountType, invController.buildAddInventory);
// Post route to add inventory item
router.post("/add-inventory",utilities.checkAccountType,regValidate.inventoryRules(),regValidate.checkInventoryData,invController.addInventory);
// Get inventory items based on classification id
router.get("/getInventory/:classification_id",utilities.checkAccountType, invController.getInventoryJSON);
// Edit Inventory Item
router.get("/edit/:inventoryId",utilities.checkAccountType, invController.buildEditInventory);
// Post route to update inventory item
router.post("/edit-inventory",utilities.checkAccountType,regValidate.inventoryRules(),regValidate.checkUpdateData,invController.updateInventory);
// Delete Inventory Item
router.get("/delete/:inventoryId",utilities.checkAccountType, invController.buildDeleteInventory);
router.post("/delete",utilities.checkAccountType, invController.deleteInventory);
module.exports = router;