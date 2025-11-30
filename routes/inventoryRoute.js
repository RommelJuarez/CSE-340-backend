// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

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
// Get inventory items based on classification id
router.get("/getInventory/:classification_id", invController.getInventoryJSON);
// Edit Inventory Item
router.get("/edit/:inventoryId", invController.buildEditInventory);
// Post route to update inventory item
router.post("/edit-inventory",regValidate.inventoryRules(),regValidate.checkUpdateData,invController.updateInventory);
// Delete Inventory Item
router.get("/delete/:inventoryId", invController.buildDeleteInventory);
router.post("/delete", invController.deleteInventory);
module.exports = router;