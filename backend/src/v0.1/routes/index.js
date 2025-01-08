const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuración de multer para manejar cargas de archivos
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

// LANG
const lang = require("../../controllers/lang_cotroller/langController");
router.get('/languages', lang.getLanguages)
router.post('/lang', lang.addLang)

// PLATES
const plates = require("../../controllers/plate_controller/plateController");
router.get('/plates', plates.getAll);
router.get('/plates/translations', plates.getTranslations);
router.post('/plates', upload.single('file'), plates.newPlate);
router.patch('/plates', upload.single('file'), plates.updatePlate);
router.delete('/plates', plates.deletePlate);

// SHIFTS
const shifts = require("../../controllers/shift_controller/shiftController");
router.get('/shifts', shifts.getAll);
router.get('/calendar', shifts.getCalendar);
router.post('/calendar', shifts.updateCalendar);

//ORDERS
const orders = require("../../controllers/order_controller/orderController");
router.get('/orders', orders.getAll)
router.post('/orders', orders.newOrder)
router.post('/orders/state', orders.updateState)
router.post('/orders/state/plates', orders.updatePlate)

// LABELS
const labels = require("../../controllers/label_controller/labelController");
router.get('/labels', labels.getAll)
router.post('/labels', labels.newLabel)
router.delete('/labels', labels.deleteLabel)

module.exports = router;