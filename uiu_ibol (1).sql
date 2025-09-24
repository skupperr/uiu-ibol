-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-uiu-ibol-skupperr-uiu-ibol.e.aivencloud.com:14443
-- Generation Time: Sep 24, 2025 at 05:15 AM
-- Server version: 8.0.35
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uiu_ibol`
--

-- --------------------------------------------------------

--
-- Table structure for table `news_and_event`
--

CREATE TABLE `news_and_event` (
  `id` int NOT NULL,
  `type` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `link_title` text COLLATE utf8mb4_general_ci NOT NULL,
  `link` text COLLATE utf8mb4_general_ci NOT NULL,
  `authors` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `time_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news_and_event`
--

INSERT INTO `news_and_event` (`id`, `type`, `title`, `description`, `link_title`, `link`, `authors`, `time_date`) VALUES
(1, 'EVENT', 'We are excited to co-host the groundbreaking event “Deep Learning in Computational and Spatial Biology”, taking place from April 26 to May 10, 2025, in collaboration with UIU Computer Club and UIU Dat', 'This event bridges AI and biology through hands-on training, an exciting competition, and expert talks. It’s a unique platform to explore deep learning in spatial biology and multi-omics research. Exciting prizes await, including the Best Abstract Award.', 'Registration Link:', 'https://uiudsc.uiu.ac.bd/events/deep-learning-biology-workshop?fbclid=IwY2xjawJnQ2xleHRuA2FlbQIxMAABHnStb1M6dEX7-UFYSMzaQ2L8Updfx9EYzDSMxFAQ0mAynrRMy9QcW5DopghO_aem_uYzDaShq5zz3Ywoaw9MIgQ', 'Fahim Hafiz', '2025-04-12 12:08:26'),
(3, 'NEWS', 'A paper on the heart disease prediction is published in Computer Methods and Programs in Biomedicine', '', 'Please find the details at:', 'https://www.sciencedirect.com/science/article/abs/pii/S0169260725001191', 'Fahim Hafiz', '2025-04-12 12:12:31'),
(6, 'NEWS', 'A paper on structure-based drug design titled “CoDNet: controlled diffusion network for structure-based drug design” is published in the Oxford Bioinformatics Advances!', 'This was the result of the undergraduate FYDP group.', 'Find the details at:', 'https://academic.oup.com/bioinformaticsadvances/article/5/1/vbaf031/8025957', 'Fahim Hafiz', '2025-09-10 19:28:30');

-- --------------------------------------------------------

--
-- Table structure for table `publications`
--

CREATE TABLE `publications` (
  `id` int NOT NULL,
  `title` text COLLATE utf8mb4_general_ci NOT NULL,
  `abstract` text COLLATE utf8mb4_general_ci NOT NULL,
  `link` text COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publications`
--

INSERT INTO `publications` (`id`, `title`, `abstract`, `link`, `date`) VALUES
(1, 'Purity estimation from differentially methylated sites using Illumina Infinium methylation microarray data', 'Solid tissues collected from patient-driven clinical settings are composed of both normal and cancer cells, which often precede complications in data analysis and epigenetic findings. The Purity estimation of samples is crucial for reliable genomic aberration identification and uniform inter-sample and inter-patient comparisons as well.', 'https://www.tandfonline.com/doi/full/10.1080/15384101.2020.1789315', '2020-08-17'),
(2, 'Predicting potential miRNA-disease associations by combining gradient boosting decision tree with logistic regression', 'MicroRNAs (miRNAs) have been proved to play an indispensable role in many fundamental biological processes, and the dysregulation of miRNAs is closely correlated with human complex diseases. Many studies have focused on the prediction of potential miRNA-disease associations', 'https://www.sciencedirect.com/science/article/abs/pii/S1476927119308096', '2020-04-01'),
(4, 'Cell-specific gene association network construction from single-cell RNA sequence', 'The recent development of a high throughput single-cell RNA sequence devises the opportunity to study entire transcriptomes in the smallest detail. It also leads to the characterization of molecules and subtypes of a cell. Cancer epigenetics induced not only from individual molecules but also from the dysfunction of the system and the coupling effect of genes', 'https://www.tandfonline.com/doi/full/10.1080/15384101.2021.1978265', '2021-11-02'),
(7, 'CDSImpute: An ensemble similarity imputation method for single-cell RNA sequence dropouts', 'Single-cell RNA-sequencing enables the opportunity to investigate cell heterogeneity, discover new types of cells and to perform transcriptomic reconstruction at a single-cell resolution. Due to technical inadequacy, the presence of dropout events hinders the downstream and differential expression analysis', 'https://www.sciencedirect.com/science/article/abs/pii/S0010482522004504', '2022-07-01');

-- --------------------------------------------------------

--
-- Table structure for table `publication_authors`
--

CREATE TABLE `publication_authors` (
  `id` int NOT NULL,
  `publication_id` int DEFAULT NULL,
  `author_name` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publication_authors`
--

INSERT INTO `publication_authors` (`id`, `publication_id`, `author_name`) VALUES
(5, 2, 'Su Zhou'),
(6, 2, 'Shulin Wang'),
(7, 2, 'Qi Wu'),
(8, 2, 'Riasat Azim'),
(9, 2, 'Wen Li'),
(24, 1, 'Riasat Azim'),
(25, 1, 'Shulin Wang'),
(26, 1, 'Su Zhou'),
(27, 1, 'Xing Zhong'),
(35, 4, 'Riasat Azim'),
(36, 4, 'Shulin Wang'),
(52, 7, 'Riasat Azim'),
(53, 7, 'Shulin Wang'),
(54, 7, 'Shoaib Ahmed Dipu');

-- --------------------------------------------------------

--
-- Table structure for table `research`
--

CREATE TABLE `research` (
  `id` int NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `img_link` text COLLATE utf8mb4_general_ci,
  `time_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `research`
--

INSERT INTO `research` (`id`, `type`, `title`, `description`, `img_link`, `time_date`) VALUES
(2, 'research-focus', 'Non coding RNA and their relationship with disease and drug', 'Non-coding RNAs (ncRNAs) play a critical role in gene regulation and are increasingly linked to diseases and drug responses. Our lab utilizes machine learning algorithms to analyze complex multi-omics data and uncover novel ncRNA-disease-drug associations. By integrating computational approaches with biomedical insights, we aim to identify key ncRNA biomarkers and therapeutic targets. This research enhances our understanding of ncRNA functions in disease mechanisms and drug interactions. Our work bridges bioinformatics and translational medicine, driving innovations in precision medicine.', NULL, '2025-09-06 22:31:59'),
(3, 'research-focus', 'Large Language model in drug synergy', 'Drug synergy plays a crucial role in optimizing combination therapies for improved treatment outcomes. Our lab leverages Large Language Models (LLMs) and deep learning algorithms to predict and analyze drug synergy mechanisms. By integrating multi-omics data and biomedical knowledge, we aim to enhance drug repurposing and precision medicine strategies. Our research focuses on uncovering novel drug interactions and their impact on disease treatment. This work bridges artificial intelligence and pharmacology to accelerate drug discovery and therapeutic advancements.', NULL, '2025-09-06 22:32:36'),
(4, 'ongoing-projects', 'Marker Gene Based Clustering of scRNA seq data', 'The heterogeneous nature observed among cellular organisms can be effectively addressed through the ongoing advancement of single-cell RNA sequencing. A key priority in this effort is the precise classification of cells and cell-type functionality. Central to this initiative is the development and application of systematic methodologies for accurately identifying marker genes that uniquely characterize each cell type. However, traditional methodologies often fall short due to several limitations, including a lack of interpretability tools, high dropout rates in scRNA-seq, and the absence of a unified strategy for marker gene identification. These shortcomings are largely due to their inability to extract biological information and pertinent insights from complex datasets.\n\nOur method proposed a unified and hybridised methodology, which integrates deep learning models to unveil intricate pathways that define specific cell-type behavior during special conditions. It is scalable, applies to scRNA-seq data, and resolves transcriptomics data spatially. Additionally, it outperforms other publicly available techniques on clustering genes across five datasets, as validated by higher ARI and NMI values, which indicate its accuracy in clustering and the stability of our pipeline. Finally, we evaluated this technique against seven other leading methods using seven scRNA-seq datasets for comparison.\n\nThe introduction of our framework can further enhance the expression profiles of individual cellular organisms that define cell states and offer higher-quality benchmarks for future publishers.', NULL, '2025-09-06 22:33:23'),
(6, 'research-focus', 'Sample/ specific network and precision Medicine', 'Our lab develops sample-specific network approaches for precision medicine, offering a novel way to analyze single-cell RNA sequencing (scRNA-seq) data. Instead of focusing solely on differentially expressed genes, our method uncovers latent biological knowledge by analyzing molecular interactions within gene association networks. This approach identifies key genes with low expression variability but significant regulatory influence. By integrating network-based machine learning models, we aim to enhance disease characterization and therapeutic targeting. Our research advances precision medicine by uncovering hidden molecular mechanisms in complex biological systems.', NULL, '2025-09-07 00:43:14'),
(7, 'research-focus', 'Spatial Transcriptomics', 'Our lab is working on Spatial Transcriptomics datasets to identify spatial domains, analyze their interactions, and address dropout imputation challenges. By leveraging deep learning and computational models, we aim to enhance the resolution and accuracy of spatial gene expression data. Our research focuses on uncovering tissue organization, cell-cell communication, and functional heterogeneity in complex biological systems. We develop advanced methods to integrate spatial and molecular information for improved biological interpretation. These efforts contribute to a deeper understanding of development, disease progression, and therapeutic strategies.', 'https://firebasestorage.googleapis.com/v0/b/uiu-ibol.firebasestorage.app/o/uploads%2F1757503924428-Spatial-transcriptomics.jpg?alt=media&token=b77730a1-07bf-43ff-8022-35b488e51084', '2025-09-07 00:44:44');

-- --------------------------------------------------------

--
-- Table structure for table `research_image`
--

CREATE TABLE `research_image` (
  `id` int NOT NULL,
  `research_id` int DEFAULT NULL,
  `img_link` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `research_image`
--

INSERT INTO `research_image` (`id`, `research_id`, `img_link`) VALUES
(1, 7, 'https://firebasestorage.googleapis.com/v0/b/uiu-ibol.firebasestorage.app/o/uploads%2F1757503924428-Spatial-transcriptomics.jpg?alt=media&token=b77730a1-07bf-43ff-8022-35b488e51084');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `role_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `position` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `position`, `created_at`) VALUES
(5, 'Student', 4, '2025-09-09 08:12:02'),
(6, 'MAIN TEAM LEAD', 2, '2025-09-09 12:53:31');

-- --------------------------------------------------------

--
-- Table structure for table `role_assignments`
--

CREATE TABLE `role_assignments` (
  `id` int NOT NULL,
  `role_id` int NOT NULL,
  `user_id` varchar(128) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_assignments`
--

INSERT INTO `role_assignments` (`id`, `role_id`, `user_id`) VALUES
(16, 6, '4frSRQp1IcYYApcfM35lYFuaGmx1');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `uid` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_type` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'regular',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_tag` text COLLATE utf8mb4_general_ci,
  `img_link` text COLLATE utf8mb4_general_ci,
  `linkedin` text COLLATE utf8mb4_general_ci,
  `github` text COLLATE utf8mb4_general_ci,
  `research_gate` text COLLATE utf8mb4_general_ci,
  `google_scholar` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uid`, `email`, `account_type`, `created_at`, `name`, `profile_tag`, `img_link`, `linkedin`, `github`, `research_gate`, `google_scholar`) VALUES
(2, '4frSRQp1IcYYApcfM35lYFuaGmx1', 'mylifeasasif@gmail.com', 'admin', '2025-09-07 18:32:58', 'Asif Uddin Ahmed', 'Undergraduate Student', 'https://firebasestorage.googleapis.com/v0/b/uiu-ibol.firebasestorage.app/o/profile%2F1757344128731-454610989_3973438512942778_4936276281036644137_n.jpg?alt=media&token=94e40ebd-033a-4f60-b58e-ae7568044488', 'https://www.linkedin.com/in/asifuahmed/', 'https://github.com/skupperr', 'https://github.com/skupperr', 'https://github.com/skupperr');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `news_and_event`
--
ALTER TABLE `news_and_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `publication_authors`
--
ALTER TABLE `publication_authors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_publication_authors_publications` (`publication_id`);

--
-- Indexes for table `research`
--
ALTER TABLE `research`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `research_image`
--
ALTER TABLE `research_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_research_image_research` (`research_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_assignments`
--
ALTER TABLE `role_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `news_and_event`
--
ALTER TABLE `news_and_event`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `publications`
--
ALTER TABLE `publications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `publication_authors`
--
ALTER TABLE `publication_authors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `research`
--
ALTER TABLE `research`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `research_image`
--
ALTER TABLE `research_image`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `role_assignments`
--
ALTER TABLE `role_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `publication_authors`
--
ALTER TABLE `publication_authors`
  ADD CONSTRAINT `fk_publication_authors_publications` FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `research_image`
--
ALTER TABLE `research_image`
  ADD CONSTRAINT `fk_research_image_research` FOREIGN KEY (`research_id`) REFERENCES `research` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_assignments`
--
ALTER TABLE `role_assignments`
  ADD CONSTRAINT `role_assignments_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
