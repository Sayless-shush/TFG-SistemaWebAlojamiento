CREATE DATABASE  IF NOT EXISTS `tfg_alojamiento` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tfg_alojamiento`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: tfg_alojamiento
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clubes`
--

DROP TABLE IF EXISTS `clubes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `contacto_nombre` varchar(100) DEFAULT NULL,
  `contacto_email` varchar(100) DEFAULT NULL,
  `comentarios` text,
  `tipo_habitacion_deseada` varchar(50) DEFAULT NULL,
  `contacto_telefono` varchar(50) DEFAULT NULL,
  `comercial` varchar(100) DEFAULT NULL,
  `tiene_bus` tinyint(1) DEFAULT '0',
  `categoria_pagada` varchar(255) DEFAULT NULL COMMENT 'Tipo de hotel pagado por el club',
  `hotel_manual_id` int DEFAULT NULL COMMENT 'ID del hotel asignado manualmente forzado',
  PRIMARY KEY (`id`),
  KEY `fk_clubes_hotel_manual` (`hotel_manual_id`),
  CONSTRAINT `fk_clubes_hotel_manual` FOREIGN KEY (`hotel_manual_id`) REFERENCES `hoteles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubes`
--

LOCK TABLES `clubes` WRITE;
/*!40000 ALTER TABLE `clubes` DISABLE KEYS */;
INSERT INTO `clubes` VALUES (40,'Real Madrid',NULL,NULL,NULL,NULL,NULL,'SIN PATROCINIO',1,'Resort',NULL),(41,'Barcelona',NULL,NULL,NULL,NULL,NULL,'SIN PATROCINIO',0,'3 estrellas',27),(42,'Mallorca',NULL,NULL,NULL,NULL,NULL,'SIN PATROCINIO',1,'3 estrellas',29),(43,'Valencia',NULL,NULL,NULL,NULL,NULL,'SIN PATROCINIO',0,'4 estrellas',NULL);
/*!40000 ALTER TABLE `clubes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `club_id` int NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `num_jugadores` int DEFAULT '0',
  `num_entrenadores` int DEFAULT '0',
  `num_acompanantes` int DEFAULT '0',
  `fecha_check_in` date DEFAULT NULL,
  `fecha_check_out` date DEFAULT NULL,
  `tipo_comida` varchar(50) DEFAULT NULL,
  `necesita_transporte` tinyint(1) DEFAULT '0',
  `preferencias` text,
  `tipo_habitacion_deseada` varchar(50) DEFAULT NULL,
  `manual_dobles` int DEFAULT '0',
  `manual_individuales` int DEFAULT '0',
  `tipologia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (68,40,'U12',10,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Cuádruple',0,0,NULL),(69,40,'U14',4,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Cuádruple',2,0,NULL),(71,41,'U11',4,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Cuádruple',0,0,NULL),(72,42,'U14',12,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Cuádruple',0,0,NULL),(73,42,'U16',4,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Cuádruple',0,0,NULL),(74,43,'U15',9,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Triple',0,0,NULL),(75,43,'U16',6,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Triple',0,0,NULL),(76,41,'U10',8,0,0,'2026-06-09','2026-06-11',NULL,0,NULL,'Cuádruple',0,0,NULL);
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitaciones`
--

DROP TABLE IF EXISTS `habitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hotel_id` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `capacidad` int NOT NULL,
  `cantidad_total` int NOT NULL,
  `disponible_desde` date DEFAULT NULL,
  `disponible_hasta` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hoteles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitaciones`
--

LOCK TABLES `habitaciones` WRITE;
/*!40000 ALTER TABLE `habitaciones` DISABLE KEYS */;
INSERT INTO `habitaciones` VALUES (35,27,'Cuádruple',4,10,'2026-06-01','2026-06-20'),(36,27,'Doble',2,5,'2026-06-01','2026-06-20'),(37,28,'Triple',3,5,'2026-06-01','2026-06-20'),(38,29,'Cuádruple',4,5,'2026-06-01','2026-06-20');
/*!40000 ALTER TABLE `habitaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoteles`
--

DROP TABLE IF EXISTS `hoteles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoteles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `cerca_autobus` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoteles`
--

LOCK TABLES `hoteles` WRITE;
/*!40000 ALTER TABLE `hoteles` DISABLE KEYS */;
INSERT INTO `hoteles` VALUES (27,'PARAISO','Resort',1),(28,'CENTRAL','4 estrellas',0),(29,'VIP','4 estrellas',1),(32,'ECO','3 estrellas',1);
/*!40000 ALTER TABLE `hoteles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-09 17:34:21
