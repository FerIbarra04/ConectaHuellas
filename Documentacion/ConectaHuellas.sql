-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: tramway.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animales`
--

DROP TABLE IF EXISTS `animales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `edad` varchar(50) DEFAULT NULL,
  `tamaño` varchar(50) DEFAULT NULL,
  `convivencia_perros` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `multimedia` json DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tags` json DEFAULT NULL,
  `fecha_alta_coordinacion` date DEFAULT NULL,
  `fecha_registro_sistema` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_adopcion` date DEFAULT NULL,
  `origen` enum('coordinacion','solicitud_externa') NOT NULL DEFAULT 'coordinacion',
  `solicitud_origen_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animales`
--

LOCK TABLES `animales` WRITE;
/*!40000 ALTER TABLE `animales` DISABLE KEYS */;
INSERT INTO `animales` VALUES (50,'Blacky','6 meses','mediano','0','Ama jugar con pelotas y peluches','[{\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785268495/conecta-huellas/file_iobixj.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785268500/conecta-huellas/file_jpravb.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/video/upload/v1785268513/conecta-huellas/file_hqvyq9.mov\", \"type\": \"video\"}]','disponible','2026-07-28 19:55:21','[\"timida\", \"juguetona\", \"amorosa\"]','2026-04-07','2026-07-28 19:55:21',NULL,'coordinacion',NULL),(51,'Bruno','6 años','grande','0','Prefiere los lugares tranquilos','[{\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785268856/conecta-huellas/file_x9dnvc.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785268864/conecta-huellas/file_ohwozr.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/video/upload/v1785268872/conecta-huellas/file_yi7s2m.mov\", \"type\": \"video\"}]','disponible','2026-07-28 20:01:17','[\"timido\", \"cariñoso\", \"obediente\", \"alegre\", \"amigable\"]','2026-03-18','2026-07-28 20:01:17',NULL,'coordinacion',NULL),(52,'Mommy','1 año','pequeño','0','Le gusta estar tranquila y convive con otros michis','[{\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785268959/conecta-huellas/file_q8d0fi.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785268964/conecta-huellas/file_x78bxl.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/video/upload/v1785269030/conecta-huellas/file_edvcw8.mov\", \"type\": \"video\"}]','disponible','2026-07-28 20:03:55','[\"amigable\", \"pacifica\"]','2026-04-09','2026-07-28 20:03:55',NULL,'coordinacion',NULL);
/*!40000 ALTER TABLE `animales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion_landing`
--

DROP TABLE IF EXISTS `configuracion_landing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_landing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hero` json NOT NULL,
  `proposito` json NOT NULL,
  `proceso_adopcion` json NOT NULL,
  `concientizacion` json NOT NULL,
  `footer` json NOT NULL,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_landing`
--

LOCK TABLES `configuracion_landing` WRITE;
/*!40000 ALTER TABLE `configuracion_landing` DISABLE KEYS */;
INSERT INTO `configuracion_landing` VALUES (1,'{\"frase\": \"Adoptar no cambia el mundo, pero cambia el mundo de un animal.\", \"titulo\": \"Cada huella merece una segunda oportunidad en tu familia\", \"descripcion\": \"Conecta Huellas ayuda a encontrar un hogar lleno de amor para perros y gatos bajo resguardo de la Coordinacion de Medio Ambiente y Protección \"}','[{\"titulo\": \"Dar una segunda oportunidad \", \"descripcion\": \"Promovemos la adopción responsable y el bienestar de cada animal bajo nuestro resguardo.\"}, {\"titulo\": \"Fomentar la tenencia responsable \", \"descripcion\": \"Adoptar es un compromiso para toda la vida, lleno de amor, cuidado y responsabilidad. \"}, {\"titulo\": \"Crear conciencia\", \"descripcion\": \"Pequeñas acciones generan grandes cambios para los animales y el medio ambiente. \"}]','[{\"titulo\": \"Explora los animales disponibles \", \"descripcion\": \"Navega el catálogo de animales bajo resguardo y encuentra a quien conecte contigo.\"}, {\"titulo\": \"Encuentra a tu compañero ideal \", \"descripcion\": \"Conoce su historia, características y necesidades antes de tomar una decisión.\"}, {\"titulo\": \"Ponte en contacto\", \"descripcion\": \"Comunícate con la Coordinación para iniciar el proceso de adopción responsable. \"}, {\"titulo\": \"Comienza una nueva historia\", \"descripcion\": \"Abre las puertas de tu hogar y dale una segunda oportunidad a una vida que lo necesita.\"}]','[{\"titulo\": \"Adopción responsable\", \"descripcion\": \"Adoptar a un animal es una decisión de vida. Implica tiempo, dedicación, atención veterinaria y amor incondicional.\"}, {\"titulo\": \"No al abandono\", \"descripcion\": \"Abandonar a una mascota es una forma de maltrato. Antes de adoptar, reflexiona si estás preparado para este compromiso. \"}, {\"titulo\": \"Cuidado y compromiso \", \"descripcion\": \"Una mascota necesita alimentación, atención veterinaria, ejercicio y mucho afecto. El cuidado es un acto diario de amor. \"}]','{\"frase\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. \", \"correo\": \"cmaypa.chih@gmail.com\", \"descripcion\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\", \"facebook_url\": \"https://www.facebook.com/profile.php?id=61575306877073\", \"instagram_url\": \"https://www.instagram.com/cmaypacuu/\"}','2026-08-05 05:28:21');
/*!40000 ALTER TABLE `configuracion_landing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_animales_destacados`
--

DROP TABLE IF EXISTS `landing_animales_destacados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_animales_destacados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `imagen_sin_fondo_url` text NOT NULL,
  `orden` int NOT NULL DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_animal_destacado` (`animal_id`),
  CONSTRAINT `landing_animales_destacados_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_animales_destacados`
--

LOCK TABLES `landing_animales_destacados` WRITE;
/*!40000 ALTER TABLE `landing_animales_destacados` DISABLE KEYS */;
INSERT INTO `landing_animales_destacados` VALUES (6,50,'https://res.cloudinary.com/dilv1ib5m/image/upload/v1785269210/conecta-huellas/file_ihojdb.png',1,'2026-07-28 20:06:50'),(7,51,'https://res.cloudinary.com/dilv1ib5m/image/upload/v1785269223/conecta-huellas/file_nqyybe.png',3,'2026-07-28 20:07:04'),(8,52,'https://res.cloudinary.com/dilv1ib5m/image/upload/v1785269237/conecta-huellas/file_anj3j6.png',2,'2026-07-28 20:07:18');
/*!40000 ALTER TABLE `landing_animales_destacados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prueba`
--

DROP TABLE IF EXISTS `prueba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prueba` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prueba`
--

LOCK TABLES `prueba` WRITE;
/*!40000 ALTER TABLE `prueba` DISABLE KEYS */;
/*!40000 ALTER TABLE `prueba` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitantes`
--

DROP TABLE IF EXISTS `solicitantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_solicitante` enum('persona','agrupacion') NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `responsable` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `ubicacion` text NOT NULL,
  `comprobante_domicilio_url` text,
  `ine_url` text,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `observaciones` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitantes`
--

LOCK TABLES `solicitantes` WRITE;
/*!40000 ALTER TABLE `solicitantes` DISABLE KEYS */;
INSERT INTO `solicitantes` VALUES (3,'persona','.',NULL,'.','.','.','https://res.cloudinary.com/dilv1ib5m/image/upload/v1783972303/conecta-huellas/file_bouube.jpg','https://res.cloudinary.com/dilv1ib5m/image/upload/v1783972303/conecta-huellas/file_ukmlhx.jpg','2026-07-13 19:51:44','activo',NULL),(4,'persona','Fer',NULL,'614164928 ','ibarrafernanda2004@gmail.com','Calle 157 #6604','https://res.cloudinary.com/dilv1ib5m/image/upload/v1783972605/conecta-huellas/file_fbzrv3.jpg','https://res.cloudinary.com/dilv1ib5m/image/upload/v1783972605/conecta-huellas/file_q9sduc.jpg','2026-07-13 19:56:45','activo',NULL),(5,'persona','Luisa',NULL,'6141649285 ','ibarrafernanda2004@gmail.com','Calle 147 # 6604','https://res.cloudinary.com/dilv1ib5m/image/upload/v1783972776/conecta-huellas/file_grixjm.jpg','https://res.cloudinary.com/dilv1ib5m/image/upload/v1783972776/conecta-huellas/file_c7b021.jpg','2026-07-13 19:59:37','activo',NULL),(6,'agrupacion','Patitas felices ','Luisa ibarra ','61 4164928 ','ibarrafernanda2004@gmail.com','La pista ','https://res.cloudinary.com/dilv1ib5m/image/upload/v1784664454/conecta-huellas/file_zxb921.jpg','https://res.cloudinary.com/dilv1ib5m/image/upload/v1784664454/conecta-huellas/file_vd7di8.jpg','2026-07-21 20:07:35','activo',NULL),(7,'persona','Natalia Arvizo',NULL,'6141649285','ibarrafernanda2004@gmail.com','col la pista','https://res.cloudinary.com/dilv1ib5m/image/upload/v1785263553/conecta-huellas/file_pkhucp.png','https://res.cloudinary.com/dilv1ib5m/image/upload/v1785263553/conecta-huellas/file_urszjn.png','2026-07-28 18:32:34','activo',NULL),(8,'persona','Luisa Ibarra',NULL,'614164928 ','ibarrafernanda2004@gmail.com','Col. La pista','https://res.cloudinary.com/dilv1ib5m/image/upload/v1785271993/conecta-huellas/file_nikrht.jpg','https://res.cloudinary.com/dilv1ib5m/image/upload/v1785271993/conecta-huellas/file_lz9oaj.jpg','2026-07-28 20:53:14','activo',NULL);
/*!40000 ALTER TABLE `solicitantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_adopcion`
--

DROP TABLE IF EXISTS `solicitudes_adopcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_adopcion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `estado` enum('nueva','contactado','finalizada') NOT NULL DEFAULT 'nueva',
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_solicitud_adopcion_animal` (`animal_id`),
  CONSTRAINT `fk_solicitud_adopcion_animal` FOREIGN KEY (`animal_id`) REFERENCES `animales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_adopcion`
--

LOCK TABLES `solicitudes_adopcion` WRITE;
/*!40000 ALTER TABLE `solicitudes_adopcion` DISABLE KEYS */;
INSERT INTO `solicitudes_adopcion` VALUES (4,51,'.','6141649285','finalizada','2026-08-04 21:43:15','2026-08-04 21:47:21'),(6,50,'maria','6141649285','finalizada','2026-08-04 21:54:05','2026-08-04 22:03:43'),(7,50,'luis','6141649285','finalizada','2026-08-04 22:04:32','2026-08-04 22:14:47'),(8,51,'Maria','6141926174','finalizada','2026-08-05 07:03:01','2026-08-05 07:04:06');
/*!40000 ALTER TABLE `solicitudes_adopcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_incorporacion`
--

DROP TABLE IF EXISTS `solicitudes_incorporacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_incorporacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `folio` varchar(30) DEFAULT NULL,
  `solicitante_id` int NOT NULL,
  `animal_id` int DEFAULT NULL,
  `nombre_animal` varchar(100) DEFAULT NULL,
  `tipo_animal` enum('perro','gato') NOT NULL,
  `sexo` enum('macho','hembra','desconocido') DEFAULT 'desconocido',
  `edad_aproximada` varchar(50) DEFAULT NULL,
  `tamano` enum('pequeño','mediano','grande') NOT NULL,
  `esterilizado` enum('si','no','no_se_sabe') DEFAULT 'no_se_sabe',
  `descripcion` text,
  `lugar_estancia` text NOT NULL,
  `multimedia` json DEFAULT NULL,
  `cartilla_vacunacion_url` text,
  `estado_solicitud` enum('pendiente','en_revision','aprobada','registrada','historial','rechazada') DEFAULT 'pendiente',
  `fue_registrada` tinyint(1) NOT NULL DEFAULT '0',
  `veces_restaurada` int NOT NULL DEFAULT '0',
  `observaciones_admin` text,
  `comentario_resolucion` text,
  `fecha_solicitud` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_revision` timestamp NULL DEFAULT NULL,
  `fecha_registro_animal` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folio` (`folio`),
  KEY `fk_solicitud_solicitante` (`solicitante_id`),
  KEY `fk_solicitud_animal` (`animal_id`),
  CONSTRAINT `fk_solicitud_animal` FOREIGN KEY (`animal_id`) REFERENCES `animales` (`id`),
  CONSTRAINT `fk_solicitud_solicitante` FOREIGN KEY (`solicitante_id`) REFERENCES `solicitantes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_incorporacion`
--

LOCK TABLES `solicitudes_incorporacion` WRITE;
/*!40000 ALTER TABLE `solicitudes_incorporacion` DISABLE KEYS */;
INSERT INTO `solicitudes_incorporacion` VALUES (6,'SI-2026-9916',8,NULL,'Arrow','perro','macho','9 meses','mediano','si','Estaba debajo de un auto','Camino real','[{\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785271995/conecta-huellas/file_awkqj0.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/image/upload/v1785271995/conecta-huellas/file_hcesnv.jpg\", \"type\": \"image\"}, {\"url\": \"https://res.cloudinary.com/dilv1ib5m/video/upload/v1785272129/conecta-huellas/file_d1i66v.mp4\", \"type\": \"video\"}]',NULL,'historial',1,1,NULL,NULL,'2026-07-28 20:55:30','2026-07-28 20:56:02',NULL);
/*!40000 ALTER TABLE `solicitudes_incorporacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (30,'alegre'),(37,'amigable'),(31,'amorosa'),(35,'cariñoso'),(33,'juguetona'),(36,'obediente'),(38,'pacifica'),(32,'timida'),(34,'timido');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_admin`
--

DROP TABLE IF EXISTS `usuarios_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_admin`
--

LOCK TABLES `usuarios_admin` WRITE;
/*!40000 ALTER TABLE `usuarios_admin` DISABLE KEYS */;
INSERT INTO `usuarios_admin` VALUES (1,'ConectaHuellasAdmin','$2b$12$OtFUstwLZj9bYZ5mdvA/QuFAeQ5rwaU3kjwLuNjl7w43VQ8dWJPDm','2026-07-13 22:50:11');
/*!40000 ALTER TABLE `usuarios_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'railway'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-17 11:46:38
