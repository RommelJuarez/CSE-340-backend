// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")

// management routes
router.get("/", invController.buildManagement);
// Route to build add-classification view
router.get("/add-classification", invController.buildAddClassification);
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by inventory detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Add Classification 
router.post("/add-classification",regValidate.classificationRules(),regValidate.checkClassificationData,invController.addClassification);
// Add Inventory form 
router.get("/add-inventory", invController.buildAddInventory);
// Post route to add inventory item
router.post("/add-inventory",regValidate.inventoryRules(),regValidate.checkInventoryData,invController.addInventory);
module.exports = router;