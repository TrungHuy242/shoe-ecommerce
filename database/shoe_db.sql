-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2025 at 11:46 AM
-- Server version: 10.6.15-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shoe_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add permission', 1, 'add_permission'),
(2, 'Can change permission', 1, 'change_permission'),
(3, 'Can delete permission', 1, 'delete_permission'),
(4, 'Can view permission', 1, 'view_permission'),
(5, 'Can add group', 2, 'add_group'),
(6, 'Can change group', 2, 'change_group'),
(7, 'Can delete group', 2, 'delete_group'),
(8, 'Can view group', 2, 'view_group'),
(9, 'Can add content type', 3, 'add_contenttype'),
(10, 'Can change content type', 3, 'change_contenttype'),
(11, 'Can delete content type', 3, 'delete_contenttype'),
(12, 'Can view content type', 3, 'view_contenttype'),
(13, 'Can add session', 4, 'add_session'),
(14, 'Can change session', 4, 'change_session'),
(15, 'Can delete session', 4, 'delete_session'),
(16, 'Can view session', 4, 'view_session'),
(17, 'Can add banner', 5, 'add_banner'),
(18, 'Can change banner', 5, 'change_banner'),
(19, 'Can delete banner', 5, 'delete_banner'),
(20, 'Can view banner', 5, 'view_banner'),
(21, 'Can add brand', 6, 'add_brand'),
(22, 'Can change brand', 6, 'change_brand'),
(23, 'Can delete brand', 6, 'delete_brand'),
(24, 'Can view brand', 6, 'view_brand'),
(25, 'Can add category', 7, 'add_category'),
(26, 'Can change category', 7, 'change_category'),
(27, 'Can delete category', 7, 'delete_category'),
(28, 'Can view category', 7, 'view_category'),
(29, 'Can add color', 8, 'add_color'),
(30, 'Can change color', 8, 'change_color'),
(31, 'Can delete color', 8, 'delete_color'),
(32, 'Can view color', 8, 'view_color'),
(33, 'Can add faq', 9, 'add_faq'),
(34, 'Can change faq', 9, 'change_faq'),
(35, 'Can delete faq', 9, 'delete_faq'),
(36, 'Can view faq', 9, 'view_faq'),
(37, 'Can add gender', 10, 'add_gender'),
(38, 'Can change gender', 10, 'change_gender'),
(39, 'Can delete gender', 10, 'delete_gender'),
(40, 'Can view gender', 10, 'view_gender'),
(41, 'Can add promotion', 11, 'add_promotion'),
(42, 'Can change promotion', 11, 'change_promotion'),
(43, 'Can delete promotion', 11, 'delete_promotion'),
(44, 'Can view promotion', 11, 'view_promotion'),
(45, 'Can add size', 12, 'add_size'),
(46, 'Can change size', 12, 'change_size'),
(47, 'Can delete size', 12, 'delete_size'),
(48, 'Can view size', 12, 'view_size'),
(49, 'Can add user', 13, 'add_user'),
(50, 'Can change user', 13, 'change_user'),
(51, 'Can delete user', 13, 'delete_user'),
(52, 'Can view user', 13, 'view_user'),
(53, 'Can add cart', 14, 'add_cart'),
(54, 'Can change cart', 14, 'change_cart'),
(55, 'Can delete cart', 14, 'delete_cart'),
(56, 'Can view cart', 14, 'view_cart'),
(57, 'Can add chat bot conversation', 15, 'add_chatbotconversation'),
(58, 'Can change chat bot conversation', 15, 'change_chatbotconversation'),
(59, 'Can delete chat bot conversation', 15, 'delete_chatbotconversation'),
(60, 'Can view chat bot conversation', 15, 'view_chatbotconversation'),
(61, 'Can add notification', 16, 'add_notification'),
(62, 'Can change notification', 16, 'change_notification'),
(63, 'Can delete notification', 16, 'delete_notification'),
(64, 'Can view notification', 16, 'view_notification'),
(65, 'Can add order', 17, 'add_order'),
(66, 'Can change order', 17, 'change_order'),
(67, 'Can delete order', 17, 'delete_order'),
(68, 'Can view order', 17, 'view_order'),
(69, 'Can add payment', 18, 'add_payment'),
(70, 'Can change payment', 18, 'change_payment'),
(71, 'Can delete payment', 18, 'delete_payment'),
(72, 'Can view payment', 18, 'view_payment'),
(73, 'Can add product', 19, 'add_product'),
(74, 'Can change product', 19, 'change_product'),
(75, 'Can delete product', 19, 'delete_product'),
(76, 'Can view product', 19, 'view_product'),
(77, 'Can add order detail', 20, 'add_orderdetail'),
(78, 'Can change order detail', 20, 'change_orderdetail'),
(79, 'Can delete order detail', 20, 'delete_orderdetail'),
(80, 'Can view order detail', 20, 'view_orderdetail'),
(81, 'Can add image', 21, 'add_image'),
(82, 'Can change image', 21, 'change_image'),
(83, 'Can delete image', 21, 'delete_image'),
(84, 'Can view image', 21, 'view_image'),
(85, 'Can add cart item', 22, 'add_cartitem'),
(86, 'Can change cart item', 22, 'change_cartitem'),
(87, 'Can delete cart item', 22, 'delete_cartitem'),
(88, 'Can view cart item', 22, 'view_cartitem'),
(89, 'Can add product promotion', 23, 'add_productpromotion'),
(90, 'Can change product promotion', 23, 'change_productpromotion'),
(91, 'Can delete product promotion', 23, 'delete_productpromotion'),
(92, 'Can view product promotion', 23, 'view_productpromotion'),
(93, 'Can add wishlist', 24, 'add_wishlist'),
(94, 'Can change wishlist', 24, 'change_wishlist'),
(95, 'Can delete wishlist', 24, 'delete_wishlist'),
(96, 'Can view wishlist', 24, 'view_wishlist'),
(97, 'Can add faq category', 25, 'add_faqcategory'),
(98, 'Can change faq category', 25, 'change_faqcategory'),
(99, 'Can delete faq category', 25, 'delete_faqcategory'),
(100, 'Can view faq category', 25, 'view_faqcategory'),
(101, 'Can add unanswered question', 26, 'add_unansweredquestion'),
(102, 'Can change unanswered question', 26, 'change_unansweredquestion'),
(103, 'Can delete unanswered question', 26, 'delete_unansweredquestion'),
(104, 'Can view unanswered question', 26, 'view_unansweredquestion'),
(105, 'Can add chat session', 27, 'add_chatsession'),
(106, 'Can change chat session', 27, 'change_chatsession'),
(107, 'Can delete chat session', 27, 'delete_chatsession'),
(108, 'Can view chat session', 27, 'view_chatsession'),
(109, 'Can add review image', 28, 'add_reviewimage'),
(110, 'Can change review image', 28, 'change_reviewimage'),
(111, 'Can delete review image', 28, 'delete_reviewimage'),
(112, 'Can view review image', 28, 'view_reviewimage'),
(113, 'Can add review', 29, 'add_review'),
(114, 'Can change review', 29, 'change_review'),
(115, 'Can delete review', 29, 'delete_review'),
(116, 'Can view review', 29, 'view_review'),
(117, 'Can add shipping address', 30, 'add_shippingaddress'),
(118, 'Can change shipping address', 30, 'change_shippingaddress'),
(119, 'Can delete shipping address', 30, 'delete_shippingaddress'),
(120, 'Can view shipping address', 30, 'view_shippingaddress'),
(121, 'Can add chatbot feedback', 31, 'add_chatbotfeedback'),
(122, 'Can change chatbot feedback', 31, 'change_chatbotfeedback'),
(123, 'Can delete chatbot feedback', 31, 'delete_chatbotfeedback'),
(124, 'Can view chatbot feedback', 31, 'view_chatbotfeedback'),
(125, 'Can add Chatbot Metric', 32, 'add_chatbotmetrics'),
(126, 'Can change Chatbot Metric', 32, 'change_chatbotmetrics'),
(127, 'Can delete Chatbot Metric', 32, 'delete_chatbotmetrics'),
(128, 'Can view Chatbot Metric', 32, 'view_chatbotmetrics'),
(129, 'Can add alert', 33, 'add_alert'),
(130, 'Can change alert', 33, 'change_alert'),
(131, 'Can delete alert', 33, 'delete_alert'),
(132, 'Can view alert', 33, 'view_alert'),
(133, 'Can add Bot Configuration', 34, 'add_botconfig'),
(134, 'Can change Bot Configuration', 34, 'change_botconfig'),
(135, 'Can delete Bot Configuration', 34, 'delete_botconfig'),
(136, 'Can view Bot Configuration', 34, 'view_botconfig'),
(137, 'Can add Intent Training', 35, 'add_intenttraining'),
(138, 'Can change Intent Training', 35, 'change_intenttraining'),
(139, 'Can delete Intent Training', 35, 'delete_intenttraining'),
(140, 'Can view Intent Training', 35, 'view_intenttraining'),
(141, 'Can add conversation tag', 36, 'add_conversationtag'),
(142, 'Can change conversation tag', 36, 'change_conversationtag'),
(143, 'Can delete conversation tag', 36, 'delete_conversationtag'),
(144, 'Can view conversation tag', 36, 'view_conversationtag');

-- --------------------------------------------------------

--
-- Table structure for table `core_alert`
--

CREATE TABLE `core_alert` (
  `id` bigint(20) NOT NULL,
  `alert_type` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `severity` varchar(20) NOT NULL,
  `is_resolved` tinyint(1) NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_banner`
--

CREATE TABLE `core_banner` (
  `id` bigint(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_botconfig`
--

CREATE TABLE `core_botconfig` (
  `id` bigint(20) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `description` longtext NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_brand`
--

CREATE TABLE `core_brand` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_brand`
--

INSERT INTO `core_brand` (`id`, `name`, `image`) VALUES
(3, 'Nike', 'brands/Nike.png'),
(4, 'Adidas', 'brands/Adidas.png'),
(5, 'Puma', 'brands/Puma.png'),
(6, 'Vans', 'brands/Vans.png'),
(7, 'Converse', 'brands/Converse.png');

-- --------------------------------------------------------

--
-- Table structure for table `core_cart`
--

CREATE TABLE `core_cart` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_cart`
--

INSERT INTO `core_cart` (`id`, `created_at`, `user_id`) VALUES
(1, '2025-09-16 06:52:09.164858', 1),
(2, '2025-10-11 05:12:50.274750', 3);

-- --------------------------------------------------------

--
-- Table structure for table `core_cartitem`
--

CREATE TABLE `core_cartitem` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_cartitem`
--

INSERT INTO `core_cartitem` (`id`, `quantity`, `created_at`, `cart_id`, `product_id`) VALUES
(72, 1, '2025-10-11 06:56:26.044190', 2, 14);

-- --------------------------------------------------------

--
-- Table structure for table `core_category`
--

CREATE TABLE `core_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_category`
--

INSERT INTO `core_category` (`id`, `name`, `image`, `description`) VALUES
(1, 'Sneaker', 'categories/sneakers_c3ReFxL.jpg', 'trương minh trung huy'),
(2, 'Boots', 'categories/Boot_Oz0fxTH.jpg', 'Durable and stylish boots for outdoor and fashion trung huy'),
(4, 'Sandals', 'categories/sandals.png', 'Comfortable sandals for summer vibes');

-- --------------------------------------------------------

--
-- Table structure for table `core_chatbotconversation`
--

CREATE TABLE `core_chatbotconversation` (
  `id` bigint(20) NOT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `message` longtext NOT NULL,
  `response` longtext NOT NULL,
  `intent` varchar(50) NOT NULL,
  `response_type` varchar(20) NOT NULL,
  `sentiment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sentiment`)),
  `confidence_score` double NOT NULL,
  `processing_time` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_chatbotconversation`
--

INSERT INTO `core_chatbotconversation` (`id`, `session_id`, `message`, `response`, `intent`, `response_type`, `sentiment`, `confidence_score`, `processing_time`, `created_at`, `user_id`) VALUES
(1, NULL, 'hey tôi muốn mua một đôi giày sneaker', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.6900000000000001, 0, '2025-10-12 07:49:07.476889', 3),
(2, NULL, 'cho tôi xem có khuyến mãi nào hôm nay không', 'Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nhé! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 417.5856113433838, '2025-10-12 07:49:27.654631', 3),
(3, NULL, 'cho tôi xem vài khuyến mãi', 'Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nhé! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 140.16127586364746, '2025-10-12 07:49:36.912266', 3),
(4, NULL, 'cho tôi xem một số đơn hàng gần đây của tôi', 'Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nhé! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 139.2664909362793, '2025-10-12 07:49:50.475715', 3),
(5, NULL, 'cho tôi xem một số đơn hàng gần đây của tôi', 'Đây là trạng thái các đơn hàng gần nhất của bạn:\n\n???? Đơn #65: Đã giao hàng - 190,000.00 VND\n???? Đơn #64: Đã giao hàng - 180,000.00 VND\n', 'order_status', 'message', NULL, 0.47323943661971835, 0, '2025-10-12 07:56:40.536000', 3),
(6, NULL, 'cho tôi xem vài khuyến mãi', '???? **Khuyến mãi đang diễn ra (4 chương trình):**\n\n1. **Mã: Giam10k** - Giảm 10.0%\n   ⏰ Có hiệu lực đến: 2025-11-29\n\n2. **Mã: FreeShip** - Giảm 20.0%\n   ⏰ Có hiệu lực đến: 2025-12-30\n\n3. **Mã: Giam50** - Giảm 50.0%\n   ⏰ Có hiệu lực đến: 2025-12-12\n\n4. **Mã: Giam100** - Giảm 100.0%\n   ⏰ Có hiệu lực đến: 2025-10-12\n\nÁp dụng mã khi thanh toán để được giảm giá nhé! ????️', 'promotion', 'message', NULL, 0.672, 0, '2025-10-12 07:56:56.929140', 3),
(7, NULL, 'cho tôi xem có khuyến mãi nào hôm nay không', '???? **Khuyến mãi đang diễn ra (4 chương trình):**\n\n1. **Mã: Giam10k** - Giảm 10.0%\n   ⏰ Có hiệu lực đến: 2025-11-29\n\n2. **Mã: FreeShip** - Giảm 20.0%\n   ⏰ Có hiệu lực đến: 2025-12-30\n\n3. **Mã: Giam50** - Giảm 50.0%\n   ⏰ Có hiệu lực đến: 2025-12-12\n\n4. **Mã: Giam100** - Giảm 100.0%\n   ⏰ Có hiệu lực đến: 2025-10-12\n\nÁp dụng mã khi thanh toán để được giảm giá nhé! ????️', 'promotion', 'message', NULL, 0.45333333333333337, 0, '2025-10-12 07:57:09.984089', 3),
(8, NULL, 'hey tôi muốn mua một đôi giày sneaker', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.8333333333333334, 0, '2025-10-12 07:57:21.651290', 3),
(9, NULL, 'cho tôi một đôi giày phù hợp để đi học', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.08936170212765956, 0, '2025-10-12 07:59:09.147039', 3),
(10, NULL, 'ủa không có đôi nào phù hợp để đi học hết à', 'Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nhé! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 415.04359245300293, '2025-10-12 07:59:28.317055', 3),
(11, NULL, 'Tôi muốn một đôi giày nike', '???? **Tìm thấy 1 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.19393939393939397, 0, '2025-10-12 07:59:43.281796', 3),
(12, NULL, 'còn thương hiệu khác không', 'Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! ???? Bạn muốn tìm giày gì hôm nay?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.5, 129.3163299560547, '2025-10-12 08:00:20.766895', 3),
(13, NULL, 'Tôi đang tìm đôi giày nào mà đi học không bị đau chân, có kiểu dáng trẻ trung tí nha?', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.6, 0, '2025-10-12 08:05:40.203102', 3),
(14, NULL, 'Dạo này có ưu đãi nào cho giày thể thao không, tôi thấy bạn tôi mua được giảm giá mà?', '???? **Khuyến mãi đang diễn ra (4 chương trình):**\n\n1. **Mã: Giam10k** - Giảm 10.0%\n   ⏰ Có hiệu lực đến: 2025-11-29\n\n2. **Mã: FreeShip** - Giảm 20.0%\n   ⏰ Có hiệu lực đến: 2025-12-30\n\n3. **Mã: Giam50** - Giảm 50.0%\n   ⏰ Có hiệu lực đến: 2025-12-12\n\n4. **Mã: Giam100** - Giảm 100.0%\n   ⏰ Có hiệu lực đến: 2025-10-12\n\nÁp dụng mã khi thanh toán để được giảm giá nhé! ????️', 'promotion', 'message', NULL, 0.7, 0, '2025-10-12 08:05:57.441601', 3),
(15, NULL, 'Tôi đặt đôi Nike hôm qua rồi, giờ muốn đổi sang size 41 thì làm sao?', '???? **Footy có thể giúp bạn:**\n\n???? **Tìm kiếm sản phẩm:**\n- \"Giày Nike nam size 42\"\n- \"Giày Adidas trắng giá dưới 2 triệu\"\n- \"Tìm giày chạy bộ\"\n\n???? **Gợi ý sản phẩm:**\n- \"Gợi ý giày thể thao\"\n- \"Giày nào bền nhất?\"\n- \"Recommend giày công sở\"\n\n???? **Khuyến mãi:**\n- \"Có khuyến mãi nào không?\"\n- \"Mã giảm giá hôm nay\"\n\n???? **Đơn hàng:**\n- \"Trạng thái đơn hàng\"\n- \"Theo dõi giao hàng\"\n\nHỏi tôi bất cứ điều gì về giày dép nhé! ????', 'help', 'message', NULL, 0.6, 0, '2025-10-12 08:06:10.763928', 3),
(16, NULL, 'Tôi đang tìm đôi giày thể thao để đi học, đi bộ nhẹ và giá tầm dưới 700k. Có mẫu nào hợp không?', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.6, 0, '2025-10-12 08:20:45.548170', 3),
(17, NULL, 'Trời ơi, đôi Jordan này nhìn xịn á, nhưng không biết có size 40 không ha?', '???? **Footy có thể giúp bạn:**\n\n???? **Tìm kiếm sản phẩm:**\n- \"Giày Nike nam size 42\"\n- \"Giày Adidas trắng giá dưới 2 triệu\"\n- \"Tìm giày chạy bộ\"\n\n???? **Gợi ý sản phẩm:**\n- \"Gợi ý giày thể thao\"\n- \"Giày nào bền nhất?\"\n- \"Recommend giày công sở\"\n\n???? **Khuyến mãi:**\n- \"Có khuyến mãi nào không?\"\n- \"Mã giảm giá hôm nay\"\n\n???? **Đơn hàng:**\n- \"Trạng thái đơn hàng\"\n- \"Theo dõi giao hàng\"\n\nHỏi tôi bất cứ điều gì về giày dép nhé! ????', 'help', 'message', NULL, 0.6, 0, '2025-10-12 08:21:04.945916', 3),
(18, NULL, 'Tôi định mua đôi sneaker trắng, nhưng sợ mau dơ quá. Có lựa chọn nào khác không?', 'Tôi có thể giúp bạn thay đổi đơn hàng! Bạn muốn đổi size, màu sắc hay gì khác? ????', 'order_change_request', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.4266666666666667, 404.64162826538086, '2025-10-12 08:21:18.365517', 3),
(19, NULL, 'tôi muốn đổi size 41 sang 42', '???? **Tìm thấy 1 sản phẩm phù hợp:**\n\n1. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.16470588235294117, 0, '2025-10-12 08:21:33.842330', 3),
(20, NULL, 'Có đôi nào đi học mà êm chân không?', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.19999999999999998, 0, '2025-10-12 08:22:24.728260', 3),
(21, NULL, 'Tôi muốn mua đôi giày nào nhẹ chân, đi học cả ngày không đau', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.4056338028169014, 0, '2025-10-12 08:22:35.485819', 3),
(22, NULL, 'Hey Footy, có giày nào đẹp không?', '???? **Top 5 sản phẩm bán chạy nhất:**\n\n1. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n   ???? Đã bán: 15\n\n2. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n   ???? Đã bán: 13\n\n3. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n   ???? Đã bán: 13\n\n4. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n   ???? Đã bán: 11\n\n5. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n   ???? Đã bán: 10\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'recommendation', 'product_list', NULL, 0.4266666666666667, 0, '2025-10-12 08:22:44.694260', 3),
(23, NULL, 'Đơn hàng của tôi thế nào rồi?', 'Đây là trạng thái các đơn hàng gần nhất của bạn:\n\n???? Đơn #65: Đã giao hàng - 190,000.00 VND\n???? Đơn #64: Đã giao hàng - 180,000.00 VND\n', 'order_status', 'message', NULL, 0.7, 0, '2025-10-12 08:22:55.246675', 3),
(24, NULL, 'Size 42 có không?', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.2666666666666666, 0, '2025-10-12 08:23:02.197485', 3),
(25, NULL, 'Tôi muốn mua đôi giày đi học', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.7384615384615385, 0, '2025-10-12 08:25:53.344449', 3),
(26, NULL, 'Gợi ý giày đi làm', '???? **Top 5 sản phẩm bán chạy nhất:**\n\n1. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n   ???? Đã bán: 15\n\n2. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n   ???? Đã bán: 13\n\n3. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n   ???? Đã bán: 13\n\n4. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n   ???? Đã bán: 11\n\n5. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n   ???? Đã bán: 10\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'recommendation', 'product_list', NULL, 0.40909090909090906, 0, '2025-10-12 08:26:09.985780', 3),
(27, NULL, 'Tôi đang tìm đôi giày thể thao nhẹ, dễ phối đồ mà giá dưới 1 triệu nha.', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.6, 0, '2025-10-12 08:35:26.864542', 3),
(28, NULL, 'Dạo này có khuyến mãi nào ngon không, bạn tôi mua rẻ quá trời luôn á.', '???? **Khuyến mãi đang diễn ra (4 chương trình):**\n\n1. **Mã: Giam10k** - Giảm 10.0%\n   ⏰ Có hiệu lực đến: 2025-11-29\n\n2. **Mã: FreeShip** - Giảm 20.0%\n   ⏰ Có hiệu lực đến: 2025-12-30\n\n3. **Mã: Giam50** - Giảm 50.0%\n   ⏰ Có hiệu lực đến: 2025-12-12\n\n4. **Mã: Giam100** - Giảm 100.0%\n   ⏰ Có hiệu lực đến: 2025-10-12\n\nÁp dụng mã khi thanh toán để được giảm giá nhé! ????️', 'promotion', 'message', NULL, 0.7, 0, '2025-10-12 08:35:41.641629', 3),
(29, NULL, 'Tôi định mua đôi màu trắng nhưng sợ mau dơ quá, có màu nào thay thế nhìn vẫn đẹp không?', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.6, 0, '2025-10-12 08:35:53.916222', 3),
(30, NULL, 'Đôi Adidas Ultraboost còn size 42 không nhỉ?', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.20869565217391306, 0, '2025-10-12 08:36:05.923281', 3),
(31, NULL, 'Hôm qua tôi đặt đôi Nike Air Max mà giờ muốn đổi sang Puma size 41, được không?', 'Em sẽ giúp anh/chị đổi đơn hàng nha! ???? Anh/chị muốn đổi size, màu sắc hay gì khác ạ?', 'order_change_request', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.05555555555555555, \"is_urgent\": true, \"positive_words\": 1, \"negative_words\": 0}', 0.7, 466.0825729370117, '2025-10-12 08:36:20.225586', 3),
(32, NULL, 'đổi sang màu trắng', 'Em chưa hiểu rõ ý anh/chị lắm ???? Anh/chị có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 121.00815773010254, '2025-10-12 08:36:43.113196', 3),
(33, NULL, 'Tôi đang phân vân giữa Vans Old Skool với Converse Chuck Taylor, đôi nào đi học lâu không đau chân hơn?', '???? **Tìm thấy 1 sản phẩm phù hợp:**\n\n1. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.07578947368421053, 0, '2025-10-12 08:36:47.517397', 3),
(34, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 243.4985637664795, '2025-10-12 08:42:15.844661', 3),
(35, NULL, 'Tôi muốn một đôi giày đi học', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.12, 0, '2025-10-12 08:42:31.822497', 3),
(36, NULL, 'Có đôi nào đẹp không?', '???? **Top 5 sản phẩm bán chạy nhất:**\n\n1. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n   ???? Đã bán: 15\n\n2. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n   ???? Đã bán: 13\n\n3. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n   ???? Đã bán: 13\n\n4. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n   ???? Đã bán: 11\n\n5. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n   ???? Đã bán: 10\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'recommendation', 'product_list', NULL, 0.6, 0, '2025-10-12 08:42:42.435723', 3),
(37, NULL, '\"Gợi ý giày đi làm', '???? **Tìm thấy 5 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\n2. **Adidas Ultraboost 5.0** - Adidas\n   ???? Giá: 200,000 VND\n\n3. **Puma Suede Classic** - Puma\n   ???? Giá: 80,000 VND\n\n4. **Vans Old Skool** - Vans\n   ???? Giá: 65,000 VND\n\n5. **Converse Chuck Taylor High** - Converse\n   ???? Giá: 55,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.6, 0, '2025-10-12 08:42:50.417949', 3),
(38, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 274.72472190856934, '2025-10-12 08:45:59.507072', 3),
(39, NULL, 'Xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 107.95807838439941, '2025-10-12 08:47:25.936992', 3),
(40, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 1.3549327850341797, '2025-10-12 08:57:23.416363', 3),
(41, NULL, 'hello', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 0, '2025-10-12 08:57:31.476092', 3),
(42, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 0, '2025-10-12 08:57:37.066103', 3),
(43, NULL, 'bạn có bán đôi giày nào của thương hiệu nike không', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 0, '2025-10-12 08:57:57.437120', 3),
(44, NULL, 'tôi muốn một đôi giày nike', '???? **Tìm thấy 1 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.19393939393939397, 0, '2025-10-12 08:58:06.993983', 3),
(45, NULL, 'bạn đang là dùng gemeni pro à', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 1.0018348693847656, '2025-10-12 08:58:21.484401', 3),
(46, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 1.0018348693847656, '2025-10-12 09:00:44.571256', 3),
(47, NULL, 'xin chào bạn', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 1.0085105895996094, '2025-10-12 09:05:17.800180', 3),
(48, NULL, 'hiện tại shop mình có những thương hiệu nào vậy', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 1.0018348693847656, '2025-10-12 09:05:46.506535', 3),
(49, NULL, 'hi', 'Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! ????\n\nTôi có thể giúp bạn:\n???? Tìm kiếm giày dép\n???? Gợi ý sản phẩm\n???? Xem khuyến mãi\n???? Kiểm tra đơn hàng\n\nBạn cần gì nhé?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 0, '2025-10-12 09:32:49.858868', 3),
(50, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 5.146503448486328, '2025-10-12 09:32:54.180020', 3),
(51, NULL, 'xin chào', 'Hế lô bạn, Footy nghe nèeee ???? Bạn đang tìm em giày nào để Footy tư vấn cho nè? ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 15183.323621749878, '2025-10-12 09:54:02.308316', 3),
(52, NULL, 'tôi đang kiếm một đôi giày để đi học á', 'Mình chưa tìm thấy sản phẩm như vậy ????, bạn thử chọn thương hiệu khác nhé.', 'product_search', 'message', NULL, 0.08936170212765956, 0, '2025-10-12 09:54:26.659607', 3),
(53, NULL, 'kiếm cho tôi một đôi nike đi', '???? **Tìm thấy 1 sản phẩm phù hợp:**\n\n1. **Nike Air Max 270** - Nike\n   ???? Giá: 150,000 VND\n\nBạn muốn xem chi tiết sản phẩm nào không? ????', 'product_search', 'product_list', NULL, 0.18823529411764706, 0, '2025-10-12 09:55:01.793252', 3),
(54, 'test_session', 'xin chào', 'Hi bạn, Footy đây ạ! ???? Bạn đang tìm một em giày xinh cho mình hay cần Footy tư vấn gì thì cứ nói nha! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 12429.68773841858, '2025-10-12 10:00:16.427969', NULL),
(55, NULL, 'hey', 'Hí bạn, Footy nghe nèeee ???? Bạn đang tìm mẫu giày nào á?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 11887.867212295532, '2025-10-12 10:02:33.022400', 3),
(56, NULL, 'tôi muốn tìm một mẫu giày để đi học', 'U là trời, tìm giày đi học thì đúng tủ của Footy luôn ạ! ????\n\nMấy mẫu \"quốc dân\" như Converse Chuck Taylor hoặc Vans Old Skool là chân ái luôn đó bạn. Mấy em này vừa dễ phối đồ, đi học hay đi chơi đều keo lỳ hết nấc. ????\n\nBạn thích style cổ cao hay cổ thấp hơn để Footy tư vấn kỹ hơn cho mình nha? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.09333333333333332, 15944.737672805786, '2025-10-12 10:02:59.795798', 3),
(57, NULL, 'cho tôi xem đôi Vans xem sao', 'Dạ okaylaaa bạn ơi! Vans Old Skool thì đúng là \"huyền thoại\" trong làng đi học luôn á, phối đồ bao chất. ????\n\nMẫu này bên em giá siêu iu chỉ 65 cành thui, có màu Đen với Xanh dương nha. Hiện em còn size từ 35 tới 37 cho các bạn nữ á.\n\nBạn xem có ưng không để Footy tư vấn kĩ hơn nè? ????????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.2, 10857.554197311401, '2025-10-12 10:04:13.773844', 3),
(58, NULL, 'có hình ảnh hay đường link chi tiết sản phẩm để tôi tới xem không vậy ạ', 'Dạ có ngay đây bạn ơi! ???? Để Footy gửi bạn \"tất tần tật\" thông tin về em nó liền nha:\n\n???? **Vans Old Skool** - mẫu giày \"huyền thoại\" cho các bạn nữ ạ.\n- **Mô tả:** Em này là dòng giày trượt ván iconic, chất liệu canvas và da lộn siêu bền, đi học hay đi chơi đều \"keo lỳ\" nha! ????\n- **Màu sắc:** Bên mình hiện có 2 màu siêu dễ phối đồ là **Đen** và **Xanh dương**.\n- **Giá iu thương:** Chỉ 65.000 VNĐ thui ạ.\n\nBạn xem qua có ưng em nó không nà? ❤️', 'greeting', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.058823529411764705, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.9, 19940.873622894287, '2025-10-12 10:23:16.522752', 3),
(59, NULL, 'Ưng ạ giờ làm sao để mua nó ạ', 'Dạ chốt đơn liền tay luôn bạn uiii ????\n\nĐể mua hàng, bạn chỉ cần cho Footy xin size, màu bạn chọn, cùng với thông tin nhận hàng (tên, số điện thoại, địa chỉ) là xonggg á.\n\nÀ mà khoan, Footy mách nhỏ nè, shop đang có mã **Giam50** giảm hẳn 50% với mã **FreeShip** đó ạ. Bạn muốn Footy áp mã nào để mình mua được giá hời nhất hông? ????\n\nFooty đợi tin nhắn của bạn để chốt đơn siêu phẩm Vans này liền nha! ❤️', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 18872.764825820923, '2025-10-12 10:24:16.035316', 3),
(60, NULL, 'Oke vậy cho em một đơn ạ em tên là Đỗ Quốc Đạt , 0917428309, và áp mã Giam50 cho em với ạ', 'Okaylaaa bạn Đạt ơi, Footy chốt đơn cho mình liền nha! ????\n\nFooty đã áp mã Giam50 siêu hời cho mình rồi ạ, giá em Vans Old Skool chỉ còn 32.500 VND thuiii ❤️\n\nBạn cho Footy xin thêm size, màu (Đen/Xanh) và địa chỉ cụ thể để mình ship hàng \"tíc tắc\" cho bạn nhé! ????', 'order_status', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.043478260869565216, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.12631578947368421, 14979.911088943481, '2025-10-12 10:25:29.545508', 3),
(61, NULL, 'Dạ size 37 và màu đen ạ', 'Dạ chốt đơn cho bạn Đạt liền nha! ????\n\nFooty xác nhận lại đơn hàng của mình là một em Vans Old Skool màu đen, size 37 ha.\n\nBọn mình sẽ gói hàng và gửi đi sớm nhất cho bạn ạ. Cảm ơn bạn đã tin tưởng FootFashion ❤️????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.18064516129032257, 16344.859838485718, '2025-10-12 10:26:15.420468', 3),
(62, NULL, 'em cảm ơn ạ', 'Dạ hong có gì đâu ạ! Footy cảm ơn bạn nhiều vì đã ủng hộ shop nhaaa ❤️ Mong bạn sớm nhận được hàng và thật ưng ý với em nó ạ! ????????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 14749.094724655151, '2025-10-12 10:26:47.726566', 3),
(64, NULL, 'giày thể thao', 'Dạ bạn tìm giày thể thao thì quá chuẩn rùi ạ! ???? Bên Footy có ngay 2 em này siêu đỉnh cho bạn tham khảo nè:\n\n???? **Adidas Ultraboost 5.0 (200k):** Mẫu này chuyên chạy bộ, đệm siêu êm và trợ lực tốt lắm luôn á.\n???? **Nike Air Max 270 (150k):** Em này thì mang hằng ngày cực thoải mái, đi chơi hay đi tập nhẹ nhàng đều hợp ạ.\n\nBạn xem thử 2 em này có ưng không, hay có thích style nào cụ thể hơn để Footy tư vấn thêm nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.2333333333333333, 16904.162883758545, '2025-10-12 10:28:00.353413', 3),
(66, NULL, 'Cho em xem thông tin chi tiết đôi nike ạ', 'Dạ vâng ạ, triển luôn bạn ơi! ???? Thông tin chi tiết của em Nike Air Max 270 siêu hot đây ạ:\n\n???? **Tên**: Nike Air Max 270\n???? **Giá**: Chỉ 150 cành thui nà.\n???? **Mô tả**: Em này có đệm khí Air nên đi hàng ngày siêu êm, siêu thoải mái luôn bạn nhé.\n???? **Size nam**: Bên mình đang có sẵn size 36, 37, 38 ạ.\n???? **Màu sắc**: Có 3 màu siêu xinh là Đen, Trắng, và Xanh dương.\n\nBạn xem có ưng em nó không, hay cần mình tư vấn thêm gì cứ hú Footy nha! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 15780.115365982056, '2025-10-12 10:29:08.637049', 3),
(67, NULL, 'em nhìn là em thấy thích rồi đó', 'Hehe em này thì khỏi phải bàn rồi ạ, lên chân là chỉ có đỉnh thuii ???? Bạn mang size nào để Footy check cho mình liền nha? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 13646.531581878662, '2025-10-12 10:32:01.426781', 3),
(68, NULL, 'hi', 'Dạ Footy chào bạn ạ! Bạn đang tìm mẫu giày nào hay cần Footy tư vấn gì cứ nói mình nhaaa ????????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 9129.960536956787, '2025-10-12 13:28:39.870166', 3),
(69, NULL, 'tôi muốn một đôi giày đi học bạn có mẫu nào không', 'Dạ đi học thì có nhiều mẫu xinh lắm bạn ơi! ????\n\nMấy mẫu basic như Converse Chuck Taylor hoặc Vans Old Skool là \'quốc dân\' luôn á, siêu dễ phối đồ mà lại bền nữa. Hai em này bên mình bán chạy lắm luôn. ????\n\nCòn nếu bạn thích style năng động, thoải mái hơn thì nghía qua Nike Air Max 270 cũng ổn áp lắm đó ạ.\n\nBạn thích style nào hơn để Footy tư vấn kĩ hơn cho mình nha? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.06999999999999999, 21146.063327789307, '2025-10-12 13:29:20.938431', 3),
(70, NULL, 'Tôi đang tìm đôi giày thể thao nhẹ, đi học cả ngày mà không đau chân, giá tầm dưới 1 triệu nha.', 'U là trời, đi học cả ngày thì đúng là cần một em giày \"chân ái\" vừa nhẹ vừa êm luôn ạ! ????\n\nVới tiêu chí của bạn thì Footy recommend ngay 2 em này nha, bao êm, bao nhẹ, cân hết mọi outfit đi học luôn:\n\n???? **Adidas Ultraboost 5.0**: Em này thì nổi tiếng về độ êm rồi ạ, đệm boost đi cả ngày cũng không lo mỏi chân đâu. Giá chỉ 200.000 VNĐ thôi.\n???? **Nike Air Max 270**: Dáng siêu cưng mà đế Air đi cũng nhẹ tênh. Em này giá 150.000 VNĐ ạ, cũng quá là hợp lý.\n\nCả hai mẫu này đều dưới 1 triệu, lại cực kỳ hợp để đi học, đi chơi luôn đó bạn. Bạn thích style của Adidas hay Nike hơn để Footy tư vấn kỹ hơn nè? ????❤️', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 17481.844186782837, '2025-10-12 13:31:27.051092', 3),
(71, NULL, 'Nghe nói giày Adidas Ultraboost mang êm lắm phải không, bạn thấy sao?', 'Dạ chính xác luôn bạn ơi! Adidas Ultraboost thì nổi tiếng là \"đi như trên mây\" luôn á ????.\n\nBộ đệm của em nó siêu êm, siêu nảy, bạn đi học hay đi chơi cả ngày cũng không lo đau chân đâu ạ. Phải nói là một trong những đôi êm nhất nhà Adidas luôn đó ạ ????. Bạn mà mang đi học thì chuẩn bài luôn', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 9311.113834381104, '2025-10-12 13:32:00.835740', 3),
(72, NULL, 'Nếu so giữa Vans Old Skool và Converse Chuck Taylor thì đôi nào bền hơn để đi học hằng ngày?', 'U là trời, so kèo 2 em huyền thoại này thì đúng là đau đầu luôn á! Câu hỏi này Footy nghe quen lắm luôn nè. ????\n\nNếu mà xét về độ **bền** để \"cày cuốc\" đi học mỗi ngày thì team **Vans Old Skool** sẽ nhỉnh hơn một xíu nha bạn. Vì em nó vốn được thiết kế cho các bạn trượt ván nên form giày cứng cáp, có cả phần da lộn (suede) nên sẽ chịu mài mòn tốt hơn đó.\n\nCòn **Converse Chuck Taylor** thì thiên về vibe classic, gọn nhẹ, phối đồ thì khỏi phải bàn luôn, siêu đỉnh! ???? Tuy nhiên, vì toàn bộ là vải canvas nên nếu đi lại nhiều thì sẽ dễ bị mòn hoặc bẩn hơn một chút.\n\nTúm lại là:\n*   Ưu tiên **BỀN, TRÂU BÒ** -> Chọn ngay **Vans Old Skool** ????\n*   Ưu tiên **GỌN NHẸ, DỄ PHỐI ĐỒ** -> Múc ngay **Converse Chuck Taylor** ❤️\n\nBạn thấy ưng em nào hơn nè? Cần Footy tư vấn thêm gì thì hú mình liền nha', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.0857142857142857, 18555.219888687134, '2025-10-12 13:32:37.272462', 3),
(73, NULL, 'Tôi thích giày màu trắng nhưng sợ mau dơ, có mẫu nào tương tự nhưng ít bám bẩn hơn không?', 'U là trời, nỗi lo muôn thuở của team mê giày trắng đây rồi! Em hiểu lắm luôn á. ????\n\nNếu vậy thì bạn tham khảo thử em Adidas Ultraboost 5.0 màu xám nha. Màu này lên chân vẫn sáng sủa, \"cháy\" lắm luôn ????, mà lại không \"mong manh\" như màu trắng, đi lại vô tư hơn nhiều ạ. Đỡ phải \"nâng như nâng trứng\" mỗi khi mang đó bạn ơi. Bạn thấy em này có \"okela\" không ạ? ????', 'product_search', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.05, \"is_urgent\": true, \"positive_words\": 1, \"negative_words\": 0}', 0.6, 18962.824821472168, '2025-10-12 13:34:32.120328', 3),
(74, NULL, 'Hôm qua tôi đặt đôi Nike Air Max rồi, giờ muốn đổi sang size 42 thì làm sao?', 'Dạ em nghe ạ! U là trời, tiếc quá bạn ơi ????.\n\nEm vừa check trên hệ thống thì mẫu Nike Air Max 270 này bên em chỉ có size lớn nhất là 38 thôi ạ.\n\nHay là bạn tham khảo qua mẫu Adidas Ultraboost 5.0 thử xem sao ạ? Mẫu này bên em có đến size 41 lận, form cũng khá thoải mái, có khi bạn mang vừa đó. Dòng này đi cũng êm chân \"xỉu up xỉu down\" luôn á bạn ơi! ????\n\nBạn thấy sao ạ, có muốn em tư vấn thêm về em này hay mình hủy đơn cũ không bạn? Footy chờ tin bạn nhé! ????', 'help', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 18949.15270805359, '2025-10-12 13:35:40.012717', 3),
(75, NULL, 'hi lo', 'Hi looo, Footy chào bạn nha! Bạn đang tia em giày nào hay cần Footy tư vấn gì thì hú mình liền nhé! ????????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 14381.356477737427, '2025-10-18 06:56:35.959145', 1),
(76, NULL, 'Bên bạn có bạn giày nào của hãng nike không', 'Dạ có chứ bạn ơi! Hàng nhà Nike thì shop mình có sẵn 2 em này đang hot lắm nè. ????\n\n*   **Giày Thể Thao Nam - Nike**: Em này thì shop chỉ biết tả là \"đẹp lắm\" thuii, giá 12,300,000 VND nha bạn.\n*   **Nike Air Max 270**: Mẫu này đi siêu êm, mang hằng ngày là chuẩn bài luôn. Giá chỉ 10,000 VND, có các màu Đen, Trắng, Xanh cho bạn lựa đó. ????\n\nBạn xem thử 2 em này có hợp gu không, cần Footy tư vấn thêm gì thì nhắn mình liền nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.11851851851851852, 18909.239768981934, '2025-10-18 07:01:28.546759', 1),
(77, NULL, 'đôi nike có bao nhiêu màu', 'Dạ em Nike Air Max 270 thì shop có 3 màu siêu basic mà cực dễ phối đồ luôn: Đen, Trắng, và Xanh dương đó bạn ơi ????.\n\nCòn em Giày Thể Thao Nam Nike kia thì bạn đang thích màu nào ạ, để Footy check kho liền cho bạn xem còn không nha ????.', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 16420.735359191895, '2025-10-18 08:27:43.664686', 1),
(78, NULL, 'hi', 'Footy xin chào bạn ạaaa ???? Footy có thể giúp gì cho bạn hông nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 12474.874258041382, '2025-10-25 06:59:24.522877', 1),
(79, NULL, 'bạn có bao nhiêu sản phẩm trong cửa hàng vậy', 'Dạ hiện tại cửa hàng Footy đang có 7 mẫu giày siêu xịn sò luôn đó bạn ơi ???? Toàn là các mẫu hot hit từ Vans, Converse, Adidas, Nike,... thuiii đó.\n\nBạn đang tìm giày nam hay nữ, hay có brand nào bạn iu thích hông để Footy tư vấn kỹ hơn cho bạn nha? ????❤️', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 14583.263635635376, '2025-10-25 06:59:59.612004', 1),
(80, NULL, 'hi', 'Chào bạn! ???? Footy đây, bạn cần tìm giày gì nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 3324.028730392456, '2025-10-25 07:21:23.458332', 1),
(81, NULL, 'bạn có bán giày gì vây', 'Êy bạn iu, FootFashion nhà mình có nhiều mẫu giày xịn sò lắm luôn nè! ✨ Hiện tại tụi mình đang có mấy em hot hit như:\n\n*   **Converse Chuck Taylor High** (classic không lỗi thời!)\n*   **Vans Old Skool** (chuẩn vibe skater)\n*   **Puma Suede Classic** (siêu retro, siêu ngầu)\n*   **Adidas Ultraboost 5.0** (êm chân đỉnh cao cho ai mê chạy bộ)\n*   **Nike Air Max 270** (thoải mái cực độ cho daily wear)\n*   Và cả những mẫu **Giày Thể Thao** đa dạng từ **Vans** và **Nike** nữa nha!\n\nBạn đang tìm giày cho nam, nữ hay unisex nè? Để Footy gợi ý thêm cho bạn nà! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.13999999999999999, 10649.57308769226, '2025-10-25 07:21:43.204649', 1),
(82, NULL, 'Tìm giày cho nam á thôi', 'Oki bạn iu! Tìm giày cho nam thì FootFashion có nhiều mẫu hot hit lắm nè! ✨ Bạn có thể nghía qua mấy em này nha:\n\n*   **Converse Chuck Taylor High**: Classic khỏi bàn, phối đồ gì cũng xinh!\n*   **Adidas Ultraboost 5.0**: Êm ái, siêu nhẹ, chạy bộ hay đi hàng ngày đều đỉnh.\n*   **Nike Air Max 270**: Đệm Air siêu thoải mái, đi học đi chơi bao phê.\n*   Ngoài ra còn có mấy em **Giày Thể Thao Nam của Vans và Nike** cũng cực chất luôn nha!\n\nBạn đang tìm kiểu nào hay có màu/size yêu thích không? Nói Footy biết để tư vấn chuẩn gu bạn nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.14482758620689654, 9160.325527191162, '2025-10-25 07:22:18.931375', 1),
(83, NULL, 'tôi thích màu đen á', 'Ô là la! Đen huyền thoại luôn là chân ái đó bạn iu ơi! ???? FootFashion có mấy em giày nam màu đen siêu ngầu nè:\n*   **Converse Chuck Taylor High**\n*   **Adidas Ultraboost 5.0**\n*   **Nike Air Max 270**\n\nBạn ưng mẫu nào hay muốn mình tư vấn thêm về size/mô tả chi tiết không nè? ✨', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 6280.879497528076, '2025-10-25 07:22:56.557753', 1),
(84, NULL, 'Có khuyến mãi nào không?', 'Yasss! FootFashion đang có mấy deal siêu hời luôn đó bạn iu! ✨\n\n*   **Mã Giam50**: giảm hẳn 50% đến 12/12/2025 lận nè!\n*   **Mã FreeShip**: giảm 20% tới 30/12/2025 nhaaa!\n*   **Mã Giam10k**: giảm 10% đến 29/11/2025 luôn đó!\n\nMau chốt đơn giày đen nam bạn ưng để được hưởng ưu đãi liền nhen! ????', 'promotion', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.5621621621621622, 6346.627712249756, '2025-10-25 07:23:16.285872', 1),
(85, NULL, 'oke tôi thích đôi vans màu đen á bạn có không', 'Yasss! Có liền nha bạn iu! ???? FootFashion có em **Vans Old Skool màu đen** siêu ngầu, siêu iconic luôn đó. Giá yêu thương chỉ 10,000 VND, hiện có size 35, 36, 37. Đảm bảo mang vào là chất lừ! Bạn muốn Footy tư vấn thêm không nè? ✨', 'product_search', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.09090909090909091, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.11851851851851852, 7933.087110519409, '2025-10-25 07:23:54.679552', 1),
(86, NULL, 'có giày màu đen không', 'Yasss! Đương nhiên là có rồi bạn iu! ✨ FootFashion có kha khá mẫu giày màu đen cực chất để bạn lựa chọn nè:\n\n*   **Converse Chuck Taylor High** - Màu đen kinh điển luôn hot!\n*   **Vans Old Skool** - Iconic của dân mê trượt ván, màu đen dễ mix đồ lắm luôn.\n*   **Puma Suede Classic** - Đen huyền thoại, retro cực đỉnh.\n*   **Adidas Ultraboost 5.0** - Đen siêu ngầu, chạy bộ hay đi chơi đều đỉnh.\n*   **Nike Air Max 270** - Đen siêu êm, Air cushioning xịn xò.\n\nBạn muốn tìm giày đen của hãng nào hay size bao nhiêu nè, để Footy gợi ý chuẩn hơn nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 4909.430027008057, '2025-10-25 07:53:56.353723', 1),
(87, NULL, 'bán có bán gì ngoài giày ko', 'Ố là la, FootFashion chuyên \"fix\" đồ cho đôi chân thui ạ! ???? Team mình chỉ tập trung vào giày dép chất lừ thôi nè. Bạn tìm mẫu nào báo Footy liền nhaaa! ????✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.11666666666666665, 2877.372980117798, '2025-10-25 08:13:40.599330', 1),
(88, NULL, 'Bạn lấy được thông tin người đang nhắn với bạn đây không', 'Hông nha bạn iu ơi! ✨ Footy chỉ là AI hỗ trợ bạn mua sắm giày dép tại FootFashion thui nè, nên không có quyền hay khả năng thu thập thông tin cá nhân của bạn đâu nha. Bạn cứ yên tâm mà quẹo lựa giày xinh nè! ????????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 5205.638885498047, '2025-10-25 08:17:11.094841', 1),
(89, NULL, 'Vậy trang web này bao gồm những chức năng gì bạn có biết không', 'Heyyy! ???? Với vai trò là Footy, tớ sẽ giúp cậu:\n*   Tìm kiếm các sản phẩm giày dép siêu cool từ các brand nổi tiếng như Nike, Adidas, Vans, Converse, Puma nè. ????\n*   Xem thông tin chi tiết về từng đôi giày (giá, size, màu sắc, mô tả...).\n*   Cập nhật các chương trình khuyến mãi và mã giảm giá để cậu không bỏ lỡ deal hời nào! ????\n*   Tư vấn để cậu chọn được đôi ưng ý nhất.\n\nNói chung, tớ ở đây để shopping của cậu thật dễ dàng và vui vẻ đó! ???? Cậu muốn tìm gì hôm nay?', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 8601.340770721436, '2025-10-25 08:20:31.578564', 1),
(90, NULL, 'bạn có thể cung cấp hình ảnh và link sản phẩm không', 'Ôi xin lỗi cậu nha, Footy là AI nên không thể cung cấp trực tiếp hình ảnh hay link sản phẩm được rồi ????.\n\nNhưng mà cậu yên tâm! Footy có thể mô tả chi tiết sản phẩm, check giá, size, màu sắc... để cậu dễ hình dung nhất có thể. Cậu muốn tìm giày gì, cứ nói Footy biết nha! ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.05806451612903226, 3195.650100708008, '2025-10-25 08:21:00.119104', 1),
(91, NULL, 'cho tôi một đôi giày thương hiệu vans', 'Hello bạn iu! ???? Footy có vài em Vans xịn xò đây nè:\n\n*   **Vans Old Skool**: Em này iconic cho nữ, giá siêu hạt dẻ 10K VND, có Black, Blue, size 35-37.\n*   **Vans - Giày Thể Thao Nam**: Dành cho cả nam và nữ (unisex) nha, giá 1,200,000 VND.\n\nBạn muốn tìm giày cho ai và có size nào không để Footy gợi ý chuẩn hơn nha! ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 12550.957202911377, '2025-10-25 08:35:50.716465', 1),
(92, NULL, 'có hình ảnh hay link sản phẩm cho tôi xem không', 'Tiếc ghê bạn ơi! ???? Hiện tại Footy chưa có chức năng gửi hình hay link sản phẩm trực tiếp cho bạn xem rùi. Bạn muốn Footy mô tả chi tiết hơn về em Vans nào không, hay mình nói thêm về màu, size, giá cả nha? ????', 'recommendation', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.09090909090909091, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.6, 8333.5702419281, '2025-10-25 08:36:37.094285', 1),
(93, NULL, 'hú bạn có bán giày thể thao không', 'Hú bạn ơi! Có chứ, FootFashion tụi mình có kha khá mẫu giày thể thao xịn sò luôn nha! ✨\n\nBạn đang tìm giày thể thao cho nam hay nữ, hay có style nào đặc biệt không nè? Ví dụ như Adidas Ultraboost 5.0 chuyên chạy bộ hay mấy em Giày Thể Thao Nam từ Vans, Nike cực chất đó! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.09999999999999999, 10238.582849502563, '2025-10-25 08:48:52.296267', 1),
(94, NULL, 'Giới thiệu một đôi giày thương hiệu puma xịn nhất của shop bạn đi', 'Hú bạn ơi! ✨ Về giày Puma thì hiện FootFashion tụi mình đang có em **Puma Suede Classic** cực xịn sò luôn nha! ????\n\nEm này đúng chuẩn \"timeless\" với chất liệu da lộn mềm mại, mang vibe retro siêu cuốn hút luôn. Đặc biệt là đang có sẵn màu **Black** và **Blue** với các size **36, 37** cho các bạn nữ nè. Giá yêu thương chỉ **10,000 VND** thôi đó!\n\nTuy là mẫu Puma duy nhất của shop nhưng em nó được rất nhiều bạn mê mẩn luôn á. Nếu bạn muốn Footy gợi ý thêm mẫu nào khác thì cứ nói nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.08205128205128205, 8598.93012046814, '2025-10-25 08:49:36.853203', 1),
(95, NULL, 'Kiểm tra những đơn hàng gần nhất của tôi', 'Hehe, sorry bạn ơi! Footy là trợ lý mua sắm nên không kiểm tra được lịch sử đơn hàng cá nhân của bạn rùi ????. Mình chỉ phụ trách giới thiệu sản phẩm, check size, màu với cả deal hot thôi à.\n\nĐể kiểm tra đơn hàng, bạn có thể đăng nhập vào tài khoản của mình trên website hoặc app FootFashion nha. Hoặc nếu cần hỗ trợ thêm, bạn cứ inbox/gọi cho bộ phận chăm sóc khách hàng của tụi mình nè! ✨\n\nBạn muốn Footy tư vấn đôi nào xinh xinh hay xem mấy em đang có ưu đãi không nè? ????', 'order_status', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.2440677966101695, 8481.069087982178, '2025-10-25 08:58:44.096287', 1),
(96, NULL, 'Gợi ý giày thể thao', 'Hi bạn iu! ???? Footy có mấy em giày thể thao chất lừ nè:\n\n*   **Adidas Ultraboost 5.0**: Siêu phẩm chạy bộ êm ái, đỉnh của chóp luôn đó! Giá chỉ 100K. Có cho nam size 37, 38, màu Black/Gray nha.\n*   **Giày Thể Thao Nam - Vans**: Em này unisex, giá 1.2 triệu.\n*   **Giày Thể Thao Nam - Nike**: Cũng là lựa chọn unisex, giá 12.3 triệu lận đó!\n\nBạn ưng em nào hay muốn Footy gợi ý thêm hông? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 12825.346231460571, '2025-10-25 08:59:59.464727', 1),
(97, NULL, 'bạn có thể cho tôi xem một vài hình ảnh không', 'Ôi tiếc quá bạn iu ơi! ???? Footy là AI nên chưa thể \"show\" hình ảnh lung linh cho bạn ngắm được nè.\n\nNhưng Footy có thể mô tả chi tiết hơn về các em giày hoặc bạn muốn Footy gợi ý xem sản phẩm nào để tìm trên web FootFashion dễ hơn không? ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.06666666666666667, 3668.558120727539, '2025-10-25 09:00:23.416395', 1),
(98, NULL, 'bạn ko thể cũng cấp ảnh hay link sản phẩm à', 'Uầy, tiếc quá bạn ơi! ???? Là trợ lý mua sắm, mình chưa có chức năng gửi ảnh hay link trực tiếp đâu nè. Nhưng nếu bạn muốn xem chi tiết sản phẩm nào, cứ bảo mình nha! Mình có thể mô tả kỹ hơn hoặc bạn có thể ghé thăm website/cửa hàng của FootFashion để ngắm nhìn tận mắt nè. ????', 'recommendation', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.09090909090909091, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.6, 5653.375148773193, '2025-10-25 09:03:47.176638', 1),
(99, NULL, 'Gợi ý giày thể thao', 'Chào bạn, Footy đây! Về giày thể thao thì FootFashion có mấy em này siêu đỉnh nè: ✨\n\n*   **Adidas Ultraboost 5.0**: Em này là giày chạy bộ hiệu năng cao, đệm êm ru, cực kỳ thoải mái luôn đó! Có size 37, 38, màu Đen, Xám. Giá siêu hạt dẻ 100K thôi.\n*   **Nike Air Max 270**: Thoải mái đỉnh chóp với đệm Air, đi hàng ngày hay tập nhẹ đều okela. Có size 36, 37, 38, màu Đen, Trắng. Giá chỉ 10K.\n\nNgoài ra, Footy còn có hai mẫu **Giày Thể Thao từ Vans** (1.200.000 VND) và **Nike** (12.300.000 VND) dành cho cả nam và nữ, phong cách siêu chất! Mấy em này hiện chưa có thông tin chi tiết về size và màu sắc cụ thể, bạn muốn biết thêm thì cứ hỏi Footy nha! ????\n\nBạn ưng mẫu nào hay có yêu cầu gì khác không nè? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 14299.314022064209, '2025-10-25 09:11:50.980783', 1),
(100, NULL, 'hi', 'Heyyy! ???? Footy từ FootFashion đây nè. Bạn đang tìm giày hay cần tớ giúp gì với bộ sưu tập xịn xò của tụi mình không? ????✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 2953.824758529663, '2025-11-01 06:54:11.571499', 1),
(101, NULL, 'tôi muốn kiếm một đôi sneaker', 'Ố là la! ✨ Sneaker thì FootFashion tụi tớ có bao la luôn nè bạn ơi! ???? Bạn muốn tìm của hãng nào, hay có màu sắc, size, hay là cho nam/nữ cụ thể không nè? Kể tớ nghe thêm nha!', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 4633.857250213623, '2025-11-01 06:54:30.945378', 1),
(102, NULL, 'oke bạn có thể mô tả một số thông tin về đôi Puma không', 'Chắc chắn rùi bạn ơi! ???? Về đôi **Puma Suede Classic** nhà tớ thì em nó đúng kiểu **suede sneakers kinh điển với vibe retro cực chất** luôn đó! ✨ Giá iu thương chỉ **10,000 VND** thôi nè. Em này dành cho **nữ**, có các size **36, 37** và hai màu siêu xinh là **Black** và **Blue** nha. Đã bán được 13 đôi rùi đó! ???? Bạn thấy sao nè?', 'product_search', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.07142857142857142, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.09696969696969698, 2253.3609867095947, '2025-11-01 06:55:26.169921', 1);
INSERT INTO `core_chatbotconversation` (`id`, `session_id`, `message`, `response`, `intent`, `response_type`, `sentiment`, `confidence_score`, `processing_time`, `created_at`, `user_id`) VALUES
(103, NULL, 'cũng oke đó chừ muốn mua thì phải làm sao', 'Oke la luôn bạn ơiii! ✨ Để \"rước\" em **Puma Suede Classic** này về, bạn chỉ cần cho tớ biết size và màu bạn ưng nhé! ????\n\nEm này hiện có sẵn các size **36, 37** và hai màu siêu xinh là **Black, Blue** đó. Giá lại hạt dẻ cực kỳ, chỉ **10,000 VND** thôi nè! ????\n\nÀ, đừng quên FootFashion còn có mấy mã giảm giá siêu hot:\n*   **Giam50** (giảm 50% đến 12/12/2025)\n*   **FreeShip** (giảm 20% đến 30/12/2025)\n*   **Giam10k** (giảm 10% đến 29/11/2025)\n\nBạn cứ cho tớ biết **size và màu** bạn chọn, với cả **mã khuyến mãi** muốn dùng là tụi mình xử lý liền nha! ????', 'product_search', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.1, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.6, 4495.450496673584, '2025-11-01 06:55:57.861088', 1),
(104, NULL, 'size 36 màu blue nhé', 'Oke bạn ơi! ✨ **Puma Suede Classic** size 36 màu Blue bên mình vẫn còn đủ hàng nha. Bạn muốn mình lên đơn luôn không ạ? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 6695.247650146484, '2025-11-01 06:57:06.559092', 1),
(105, NULL, 'có tôi muốn lên đơn luôn', 'Oke luôn bạn ơi! ✨ Vậy là chốt đơn em **Puma Suede Classic size 36 màu Blue** siêu xinh với giá chỉ 10,000 VND nha! ????\n\nĐể Footy tạo đơn cho bạn, bạn vui lòng cho Footy xin các thông tin sau nè:\n1.  **Tên đầy đủ:**\n2.  **Số điện thoại:**\n3.  **Địa chỉ giao hàng:** (Chi tiết giúp Footy nha)\n\nBạn có muốn áp dụng mã giảm giá nào không? Bên mình đang có:\n-   **Giam50** (giảm 50%)\n-   **FreeShip** (giảm 20%)\n-   **Giam10k** (giảm 10%)\n\nFooty đợi tin bạn nha! ????', 'order_status', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.36923076923076925, 4120.046615600586, '2025-11-01 06:57:22.509525', 1),
(106, NULL, 'Tên trương phi hoàng , 0795508242, 102 diệp minh châu cẩm lệ đà nẵng', 'Oke bạn Trương Phi Hoàng! Footy đã nhận được thông tin giao hàng của bạn rồi nha! ✨\n\nVậy là chốt đơn em **Puma Suede Classic size 36 màu Blue** với giá siêu hạt dẻ chỉ còn **5,000 VND** (đã áp dụng mã Giam50) nè.\nFooty sẽ lên đơn và ship đến 102 Diệp Minh Châu, Cẩm Lệ, Đà Nẵng cho bạn ngay và luôn!\nBạn check tin nhắn xác nhận đơn hàng nhé. Cảm ơn bạn nhiều nhiềuuu! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 6407.114744186401, '2025-11-01 06:58:16.659901', 1),
(107, NULL, 'Có khuyến mãi nào không?', 'Yoo, Footy đây! ✨ Có ngay mấy deal siêu xịn cho bạn nè:\n\n*   Mã **Giam50**: Giảm tới 50% lận nha! Hạn dùng đến 12/12/2025.\n*   Mã **FreeShip**: Giảm 20% nè. Dùng đến 30/12/2025 nha.\n*   Mã **Giam10k**: Giảm 10% đó, nhưng mà sắp hết hạn rồi (29/11/2025) nên tranh thủ dùng nha! ????‍♀️\n\nBạn muốn Footy gợi ý đôi nào để áp mã hông? ????', 'promotion', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.5621621621621622, 8520.650148391724, '2025-11-03 09:33:31.881267', 1),
(108, NULL, 'dd', 'Uhm, bạn ơi, Footy chưa hiểu \"dd\" lắm nè ????. Bạn có thể cho Footy biết bạn đang tìm giày gì không? Kiểu dáng, hãng, hay cho nam/nữ nè? Kể Footy nghe nha! ✨', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 5577.6050090789795, '2025-11-03 09:50:20.609372', 1),
(109, NULL, 'Có khuyến mãi nào không?', 'Yoo, Footy đây! ✨ Có ngay mấy deal siêu xịn cho bạn nè:\n\n*   Mã **Giam50**: Giảm tới 50% lận nha! Hạn dùng đến 12/12/2025.\n*   Mã **FreeShip**: Giảm 20% nè. Dùng đến 30/12/2025 nha.\n*   Mã **Giam10k**: Giảm 10% đó, nhưng mà sắp hết hạn rồi (29/11/2025) nên tranh thủ dùng nha! ????‍♀️\n\nBạn muốn Footy gợi ý đôi nào để áp mã hông? ????', 'promotion', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": true, \"positive_words\": 0, \"negative_words\": 0}', 0.5621621621621622, 4.001140594482422, '2025-11-03 09:50:30.662499', 1),
(110, NULL, 'Gợi ý giày thể thao', 'Yoo bạn ơi! Footy có ngay mấy em giày thể thao xịn xò cho bạn tham khảo nè ????✨:\n\n*   **Adidas Ultraboost 5.0**: Siêu êm ái cho chạy bộ, tập luyện đỉnh kout luôn!\n*   **Nike Air Max 270**: Đệm Air cực đỉnh, đi cả ngày vẫn thấy thoải mái nha.\n*   **Air-jodan**: Chất lừ, thiết kế siêu ngầu, đúng vibe thể thao sành điệu luôn!\n*   **Vans Old Skool**: Chuẩn phong cách skate, cá tính và bền bỉ lắm đó.\n\nBạn ưng em nào để Footy kể thêm cho nghe nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6, 7913.602113723755, '2025-11-03 09:50:40.917803', 1),
(111, NULL, 'cho tôi xem hình ảnh của đôi Air-jodan', 'Yoo bạn ơi! Tiếc quá Footy không thể trực tiếp show hình ảnh ở đây được ????. Nhưng nếu bạn muốn, Footy có thể mô tả chi tiết hơn về em Air-jodan siêu chất đó cho bạn nha! Hoặc bạn muốn tìm hiểu thêm về đôi nào khác không nè? ✨????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.08372093023255814, 2661.267042160034, '2025-11-03 09:51:05.333471', 1),
(112, NULL, 'không có đường link luôn hả', 'Tiếc quá bạn ơi, Footy không có chức năng gửi đường link ở đây đâu ạ ????. Bạn thử search tên \"Air-jodan\" trên các trang tìm kiếm để xem thêm hình ảnh nha! Hoặc nếu tiện, mời bạn ghé FootFashion để Footy tư vấn kĩ hơn nè! ????✨', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 8438.871622085571, '2025-11-03 09:51:28.270909', 1),
(113, NULL, 'bên bạn có bán giày nào không nhỉ', 'Alo bạn ơi! ✨ Footy ở đây nè! Bên mình có bán siêu nhiều giày xịn xò luôn đó bạn ơi! ????\n\nBạn có thể nghía qua mấy em này nha:\n*   **Converse Chuck Taylor High:** Cực phẩm basic, lên đồ nào cũng hợp.\n*   **Vans Old Skool:** Phối đồ streetstyle là bao chất!\n*   **Puma Suede Classic:** Đậm chất retro, bao ngầu luôn.\n*   **Adidas Ultraboost 5.0:** Êm ái, chạy bộ hay đi chơi đều đỉnh.\n*   **Nike Air Max 270:** Đệm khí siêu thoải mái, đi cả ngày không mỏi.\n*   Và còn có cả **Air-Jordan** cực chất nữa đó nha!\n\nBạn đang tìm giày nam hay nữ, hay có màu sắc, size nào muốn tìm không nè? Kể Footy nghe nha, Footy gợi ý cho! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 3296.2865829467773, '2025-11-07 09:36:52.513876', 1),
(114, NULL, 'Giày này không đẹp', 'U là trời! ???? Không sao nha bạn ơi! Gu mỗi người mỗi khác mà. ???? Bạn có thể cho Footy biết bạn đang tìm giày phong cách nào, màu gì hay size bao nhiêu không nè? Bên mình còn siêu nhiều mẫu xinh xẻo khác đảm bảo bạn mê tít luôn! ✨', 'product_search', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.25, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0}', 0.6, 4436.394929885864, '2025-11-07 09:37:13.517560', 1),
(115, NULL, 'Xin chào', 'Chào bạn iu! ???? Footy đây nè! ✨ Bạn đang tìm giày hay muốn tụi mình tư vấn gì không nè? Kể Footy nghe nha! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.9, 2405.259609222412, '2025-11-07 09:37:33.162604', 1),
(116, NULL, 'Tìm giày Nike nam giá rẻ', 'Alo alo! ???? Bạn iu tìm giày Nike nam giá rẻ đúng hem? Footy có ngay Nike Air Max 270 giá siêu hạt dẻ chỉ 10,000 VND thôi nè! ✨ Có đủ size 36, 37, 38 và màu Black, White luôn đó. Quá xịn đúng hông? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.5586206896551724, 4711.4808559417725, '2025-11-07 09:38:44.322848', 1),
(117, NULL, 'Tìm giày Nike', 'Okie la! ✨ Bạn iu đang tìm giày Nike đúng không nè? Footy có liền 2 em siêu phẩm này cho bạn tham khảo nha:\n\n1.  **Nike Air Max 270** ????: Giá iu thương chỉ 10,000 VND thôi đó! Giày nam, đủ size 36, 37, 38 với 2 màu Black và White nè. Em này mang siêu thoải mái luôn!\n2.  **Air-jodan** ????: Dành cho những ai mê hàng độc và chất! Em này có giá 12,300,000 VND, là giày nam, có size 38, 39 với các màu Blue, Brown nha.\n\nBạn muốn xem chi tiết em nào hay muốn Footy tư vấn thêm không? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 3460.369825363159, '2025-11-07 09:45:21.331690', 1),
(118, NULL, 'Tìm giày Nike', 'Ơi bạn ơi, Footy có 2 em Nike siêu xịn nè! ????\n\n*   **Nike Air Max 270:** Giá 10,000 VND, có màu Đen, Trắng. Size 36, 37, 38. Mang cực êm á.\n*   **Air-jodan:** Giá 12,300,000 VND, có màu Xanh, Nâu. Size 38, 39. Em này là hàng hiếm nha!\n\nBạn ưng em nào hay muốn xem thêm thông tin không nè? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.7363636363636364, 3588.1993770599365, '2025-11-07 09:49:01.571456', 1),
(119, NULL, 'tôi muốn xem thêm thông tin', 'Okela bạn yêu! Để Footy bật mí thêm details 2 em Nike xịn sò này nha! ????\n\n**1. Nike Air Max 270 ✨**\n*   **Giá:** Chỉ 10.000 VND thui đó! Quá hời luôn!\n*   **Mô tả:** Em này êm ái xỉu với đệm Air, cân mọi outfit hàng ngày. Đi học, đi chơi đều cưng hết!\n*   **Giới tính:** Dành cho các bạn nam nè.\n*   **Sizes:** Có sẵn 36, 37, 38.\n*   **Màu sắc:** Đen và Trắng basic mà chất.\n*   **Đã bán:** 10 đôi rùi, hot lắm nha!\n\n**2. Nike Air Jordan ????**\n*   **Giá:** Em này hơi \"chát\" một xíu, 12.300.000 VND, nhưng mà đáng đồng tiền bát gạo lắm luôn đó!\n*   **Mô tả:** Nghe mô tả là \"giày ngon\" là biết đỉnh của chóp rồi ha! Huyền thoại giới sneaker đó bạn.\n*   **Giới tính:** Cũng cho nam nhen.\n*   **Sizes:** Hiện còn 38, 39.\n*   **Màu sắc:** Xanh và Nâu, siêu độc và cá tính!\n*   **Đã bán:** Mới bán được 1 đôi à, còn đợi bạn đó nha! ????\n\nBạn muốn Footy tư vấn thêm gì nữa không? Hay muốn xem ảnh em nào nè? Cứ hỏi Footy nha! ❤️', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 8774.747371673584, '2025-11-07 09:49:29.263947', 1),
(120, NULL, 'muốn xem thêm ảnh thử xem', 'Ối bạn ơi, Footy siêu muốn show ảnh cho bạn xem lắm luôn á! ???? Nhưng mà Footy là AI nên chưa thể hiển thị hình ảnh trực tiếp ở đây được nè. ????\n\nBạn thử search tên giày trên Google hoặc ghé thăm website của FootFashion (nếu có) để ngắm nhìn mấy em ấy rõ hơn nha! ✨\n\nHay là để Footy mô tả chi tiết hơn về kiểu dáng, chất liệu hay cảm giác khi mang của 2 em Nike này cho bạn dễ hình dung ha? Bạn muốn nghe về em nào trước nè? ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 2890.824794769287, '2025-11-07 09:50:00.165333', 1),
(121, NULL, 'có link sản phẩm không gửi cho tôi xem với', 'Ối bạn iu, Footy cũng muốn gửi link cho bạn xem lắm luôn á! ???? Nhưng mà Footy chưa có khả năng làm điều đó được rồi. Footy chỉ có thể mô tả chi tiết sản phẩm và trả lời các thắc mắc của bạn thôi nè.\n\nBạn muốn Footy kể thêm về đôi giày nào hay có câu hỏi gì về chúng không? Footy sẵn sàng bật mí hết cho bạn nha! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0, 4352.343320846558, '2025-11-07 09:50:23.009868', 1),
(122, NULL, 'Xem giày Nike nam', 'Oke la luôn bạn ơi! ✨ Footy có mấy em giày Nike cực phẩm cho nam nè:\n\n1.  **Nike Air Max 270** ????\n    *   Giá chỉ: 10,000 VND\n    *   Size: 36, 37, 38\n    *   Màu: Đen, Trắng\n    *   Mô tả: Êm ái cực đỉnh với đệm Air, cân mọi outfit hàng ngày luôn!\n\n2.  **Air-jodan** (tên em ấy là Air-jodan, không phải Air Jordan nha bạn!) ????\n    *   Giá: 12,300,000 VND\n    *   Size: 38, 39\n    *   Màu: Xanh dương, Nâu\n    *   Mô tả: Giày ngon bá cháy con bọ chét!\n\nBạn ưng em nào thì hú Footy liền nha! ❤️', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6230769230769231, 3494.4729804992676, '2025-11-07 09:52:27.810279', 1),
(123, NULL, 'Xem giày Nike nam', 'Oke la luôn bạn ơi! ✨ Footy có mấy em giày Nike cực phẩm cho nam nè:\n\n1.  **Nike Air Max 270** ????\n    *   Giá chỉ: 10,000 VND\n    *   Size: 36, 37, 38\n    *   Màu: Đen, Trắng\n    *   Mô tả: Êm ái cực đỉnh với đệm Air, cân mọi outfit hàng ngày luôn!\n\n2.  **Air-jodan** (tên em ấy là Air-jodan, không phải Air Jordan nha bạn!) ????\n    *   Giá: 12,300,000 VND\n    *   Size: 38, 39\n    *   Màu: Xanh dương, Nâu\n    *   Mô tả: Giày ngon bá cháy con bọ chét!\n\nBạn ưng em nào thì hú Footy liền nha! ❤️', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 40.987491607666016, '2025-11-07 09:52:39.832319', 1),
(124, NULL, 'Xem giày Nike nam', 'Hi bạn, Footy có 2 em Nike nam siêu chất nè ✨:\n\n1.  **Nike Air Max 270**: Giá 10,000 VND, có size 36, 37, 38. Màu Black, White. Em này êm ái, đệm khí Air xịn xò cho daily wear luôn.\n2.  **Air-jodan**: Giá 12,300,000 VND, có size 38, 39. Màu Blue, Brown. Em này thì \"giày ngon\" bá cháy! ????\n\nBạn ưng em nào hay muốn Footy tư vấn thêm thì cứ nói nhaaa! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6230769230769231, 4786.520957946777, '2025-11-07 11:41:08.782225', 1),
(125, NULL, 'tìm giày nam nike', 'Hé lô bạn iu! ✨ Footy tìm được 2 em giày Nike nam siêu chất cho bạn đây nè:\n\n*   **Nike Air Max 270** (Giá: 10,000 VND) - Em này êm ái, thoải mái cho daily wear luôn. Có sẵn size 36, 37, 38 với màu Black, White nha. ????\n*   **Air-jodan** (Giá: 12,300,000 VND) - Siêu phẩm \"giày ngon\" luôn, có size 38, 39 với màu Blue, Brown. Em này hot hit lắm đó! ????\n\nBạn thích em nào thì hú Footy nhen! Đừng quên check mấy mã khuyến mãi Giam50, FreeShip, Giam10k để rinh giày giá hời nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.2782608695652174, 5137.64500617981, '2025-11-07 11:42:04.468621', 1),
(126, NULL, 'Xem giày Nike nam', 'Hế lu bạn iu! ???? Footy tìm được 2 em Nike nam siêu chất cho bạn đây nè:\n\n*   **Nike Air Max 270** ✨ (Giá: 10,000 VND): Đệm Air siêu êm, mang hàng ngày bao comfy! Có size 36, 37, 38 với màu đen hoặc trắng nha.\n*   **Air-jodan** ???? (Giá: 12,300,000 VND): Em này thì chất khỏi bàn rùi, \"giày ngon\" đúng nghĩa đen! Hiện có size 38, 39 và màu xanh hoặc nâu đó.\n\nBạn ưng em nào thì hú Footy nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 6214.561700820923, '2025-11-07 11:44:39.504390', 1),
(127, NULL, 'Xem giày Nike nam', 'Hello bạn iu! ???? Footy có 2 em Nike cực chất dành cho nam nè:\n\n1.  **Nike Air Max 270** ✨\n    *   Giá chỉ 10.000 VND\n    *   Có size 36, 37, 38\n    *   Màu: Đen, Trắng\n    *   Mô tả: Êm ái, thoải mái mang hằng ngày luôn nha!\n\n2.  **Air-jodan** (cũng của Nike) ????\n    *   Giá: 12.300.000 VND\n    *   Có size 38, 39\n    *   Màu: Xanh, Nâu\n    *   Mô tả: Đỉnh của chóp, siêu phẩm luôn đó!\n\nBạn ưng em nào hay muốn Footy tư vấn thêm không nè? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6230769230769231, 4525.748491287231, '2025-11-07 13:07:26.762942', 1),
(128, NULL, 'Xem giày Nike nam', 'Chào bạn! Đồ Nike nam nhà FootFashion có nè ✨:\n\n*   **Nike Air Max 270**: Em này thoải mái cực, đệm Air xịn sò cho cả ngày dài, giá chỉ 10,000 VND. Có size 36, 37, 38, màu Đen, Trắng lun nha.\n*   **Air-jodan**: Đúng chất \"giày ngon\" luôn, giá 12,300,000 VND. Có size 38, 39, màu Xanh, Nâu nha.\n\nBạn ưng em nào hay muốn xem thêm ảnh không nè? ????????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.6230769230769231, 4544.114589691162, '2025-11-07 13:38:33.879106', 1),
(129, NULL, 'Xem giày Nike nam', 'Chào bạn! Đồ Nike nam nhà FootFashion có nè ✨:\n\n*   **Nike Air Max 270**: Em này thoải mái cực, đệm Air xịn sò cho cả ngày dài, giá chỉ 10,000 VND. Có size 36, 37, 38, màu Đen, Trắng lun nha.\n*   **Air-jodan**: Đúng chất \"giày ngon\" luôn, giá 12,300,000 VND. Có size 38, 39, màu Xanh, Nâu nha.\n\nBạn ưng em nào hay muốn xem thêm ảnh không nè? ????????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0}', 0.8, 42.55175590515137, '2025-11-07 13:40:37.655640', 1),
(130, NULL, 'tìm giày nam thương hiệu nike', 'Yooooo! Footy đâyyy! ???? Để Footy check ngay giày nam Nike cho bạn nha!\n\nFootFashion có 2 em đỉnh kout nè:\n\n*   **Nike Air Max 270** ????: Siêu thoải mái, đệm Air êm ái, đi everyday bao chất! Giá 10K, đủ size 36-38, màu Black, White nha.\n*   **Air-jodan** ????: Chắc hẳn không cần giới thiệu nhiều, em này chất lừ! Giá 12,3 triệu lận đó. Hiện có size 38, 39, màu Blue, Brown nè.\n\nBạn ưng em nào hay muốn Footy gợi ý thêm hông? Cứ ib nha! ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 7484.6343994140625, '2025-11-07 13:47:07.981838', 1),
(131, NULL, 'bạn có hình ảnh về thương hiệu đó không', 'Hình ảnh hả bạn ưiii? ???? Tiếc ghê, Footy là AI nên chưa thể show ảnh trực tiếp cho bạn được rồiii. Nhưng Footy có thể mô tả chi tiết cho bạn về hai mẫu giày Nike nam mình đang có nè:\n\n*   **Nike Air Max 270:** Em này giá 10,000 VND, có đủ size 36, 37, 38 với hai màu Black và White. Thiết kế siêu thoải mái, có đệm Air xịn xò để mang đi hàng ngày đó bạn.\n*   **Air-jodan:** Mẫu này thì khỏi bàn rồi, giá 12,300,000 VND, có size 38, 39 với màu Blue và Brown. \"Giày ngon\" đúng chuẩn luôn!\n\nBạn muốn Footy kể thêm về mẫu nào không? Hoặc có muốn tìm giày theo màu sắc hay size nào không nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.075, 4994.378566741943, '2025-11-07 13:47:57.493145', 1),
(132, NULL, 'sao không có hình ảnh về nike nào cả hả', 'Dạaa, như Footy có chia sẻ lúc nãy á, Footy là AI nên chưa thể show ảnh trực tiếp được cho bạn đâuuu. ???? Nhưng bạn yên tâm, Nike thì nhà FootFashion có nè! Bạn muốn Footy kể thêm về đôi nào hông? ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.128, 5418.226957321167, '2025-11-07 13:48:25.813993', 1),
(133, NULL, 'Xem giày Nike nam', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6230769230769231, 2529.6645164489746, '2025-11-07 14:02:23.649878', 1),
(134, NULL, 'Có hình ảnh về Nike không', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 5441.994667053223, '2025-11-07 14:02:48.487102', 1),
(135, NULL, 'Xem giày Nike', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 4617.76876449585, '2025-11-07 14:03:18.028606', 1),
(136, NULL, 'xem giày nike dành cho nam', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.2, 5091.202735900879, '2025-11-07 14:04:11.273720', 1),
(137, NULL, 'Xen sản phẩm nha', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 7040.390491485596, '2025-11-07 14:04:34.323737', 1),
(138, NULL, 'bạn biết tôi có bao nhiêu đơn hàng trong danh sách đơn hàng của tôi không', 'Em sẽ kiểm tra trạng thái đơn hàng của bạn nha! ????', 'order_status', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.14693877551020407, 3205.070734024048, '2025-11-07 14:04:58.867317', 1),
(139, NULL, 'có kết quả chưa', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 2896.611213684082, '2025-11-07 14:05:09.155239', 1),
(140, NULL, 'xin chào', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 2009.312391281128, '2025-11-07 14:18:42.708663', 1),
(141, NULL, 'hi', 'Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! ????\n\nTôi có thể giúp bạn:\n???? Tìm kiếm giày dép\n???? Gợi ý sản phẩm\n???? Xem khuyến mãi\n???? Kiểm tra đơn hàng\n\nBạn cần gì nhé?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2086.3962173461914, '2025-11-07 14:18:55.378955', 1),
(142, NULL, 'hello', 'Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! ????\n\nTôi có thể giúp bạn:\n???? Tìm kiếm giày dép\n???? Gợi ý sản phẩm\n???? Xem khuyến mãi\n???? Kiểm tra đơn hàng\n\nBạn cần gì nhé?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3842.799663543701, '2025-11-07 14:19:05.074973', 1),
(143, NULL, 'chào bạn', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 2002.8209686279297, '2025-11-07 14:19:16.993981', 1),
(144, NULL, 'xin chào bạn', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 2351.069211959839, '2025-11-07 14:24:00.113353', 1),
(145, NULL, 'hi', 'Hiiiii bạn! ???? Footy đây, bạn cần tìm đôi giày nào nè? Hay muốn tụi mình gợi ý gì không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2699.3978023529053, '2025-11-07 14:32:08.266836', 1),
(146, NULL, 'có bạn gợi ý đi', 'Okeee bạn! Để Footy gợi ý vài em hot hit nhaaa! ✨\n\nBạn có thể tham khảo **Converse Chuck Taylor High** siêu classic, **Vans Old Skool** cá tính hay **Nike Air Max 270** êm ái cả ngày nè.\nÀ mà nếu bạn muốn \'đầu tư\' hẳn một em siêu phẩm thì **Air-jodan** cũng là lựa chọn đỉnh chóp đó! ????\n\nBạn muốn Footy kể thêm về em nào không?', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 9121.082544326782, '2025-11-07 14:32:25.155822', 1),
(147, NULL, 'oke cho tôi xem một vài đôi giày thương hiệu nike đi', 'Okeee bạn luôn! ???? Nike thì Footy có mấy em này đang cực hot nè:\n\n*   **Nike Air Max 270:** Đôi này siêu êm ái, có đệm Air xịn xò, cực hợp để đi hàng ngày luôn đó!\n*   **Air-jordan:** Em này thì chất lừ khỏi bàn rồi, cực kì đỉnh cao luôn!\n\nBạn muốn Footy kể thêm chi tiết về em nào không? ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2903.355598449707, '2025-11-07 14:32:46.836193', 1),
(148, NULL, 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Có nha bạn ơi! ✨ Hệ thống sẽ tự động hiển thị sản phẩm bên dưới cho bạn xem đó! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2360.5053424835205, '2025-11-07 14:33:10.417637', 1),
(149, NULL, 'hi', 'Hello bạn ơi! ???? Footy đây, trợ lý mua sắm giày dép tại FootFashion nè. Bạn cần Footy giúp gì ạ? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2042.5820350646973, '2025-11-07 14:45:43.495302', 1),
(150, NULL, 'xin chào', 'Chào bạn nha! ???? Footy đây. Bạn đang tìm kiếm mẫu giày nào hay cần mình tư vấn gì không nè?', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 2585.517644882202, '2025-11-07 14:45:51.862197', 1),
(151, NULL, 'hello', 'Hellooo bạn! ✨ Footy đây. Bạn đang tìm mẫu giày nào hay cần mình tư vấn gì không nè?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3496.1671829223633, '2025-11-07 14:45:59.191636', 1),
(152, NULL, 'xin chào bạn nhá', 'Chào bạn nha! ✨ Footy đây. Bạn đang tìm mẫu giày nào hay cần mình tư vấn gì không nè? ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 1680.5956363677979, '2025-11-07 14:46:07.635663', 1),
(153, NULL, 'tôi muốn tìm giày nike', 'Được luôn bạn ơi! ✨ Footy có mấy em Nike siêu hot nè:\n\n*   **Nike Air Max 270**: Em này siêu thoải mái, có đệm Air êm ái cho bạn diện mỗi ngày luôn á. Giá chỉ 10,000 VND thôi nè.\n*   **Air-jodan**: Mẫu này \"giày ngon\" đúng điệu, cực chất và độc đáo. Giá 12,300,000 VND nha.\n\nBạn muốn xem kỹ hơn em nào hay có size/màu nào mình tìm không? ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.2206896551724138, 3282.1578979492188, '2025-11-07 14:46:25.021068', 1),
(154, NULL, 'có giày adidas không', 'Được luôn bạn ơi! ✨ Bên FootFashion có em Adidas Ultraboost 5.0 siêu xịn nè:\n\n*   **Adidas Ultraboost 5.0**: Em này là giày chạy bộ hiệu suất cao, có đệm phản hồi cực êm ái luôn. Giá 100,000 VND, có sẵn size 37, 38 với hai màu Black và Gray nha. Giày này dành cho nam đó bạn!\n\nBạn thấy em này có ưng không nè? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2774.3489742279053, '2025-11-07 14:47:09.947420', 1),
(155, NULL, 'cho tôi xem giày nam', 'Chào bạn, Footy có sẵn nhiều mẫu giày nam cực cool nè! ✨\n\n*   **Converse Chuck Taylor High**: Mẫu classic high-top, siêu dễ phối đồ luôn.\n*   **Adidas Ultraboost 5.0**: Giày chạy bộ hiệu suất cao, êm ái xịn sò.\n*   **Nike Air Max 270**: Thoải mái cả ngày dài với đệm Air đặc trưng.\n*   **Air-jodan**: Mẫu giày \"ngon\" đỉnh chóp, dành cho những ai thích sự độc đáo!\n\nBạn tham khảo nha! Các em nó sẽ hiện ngay bên dưới đó. ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 3231.9822311401367, '2025-11-07 14:47:26.492737', 1),
(156, NULL, 'tìm giày nữ cho tôi', 'Được luôn bạn ơi! ✨ Footy có mấy em giày nữ cực xinh cho bạn đây nè:\n\n*   **Vans Old Skool** - Vans: Em này là giày skate siêu iconic, chất liệu canvas và da lộn bền bỉ, mang lên vừa cool vừa cá tính luôn!\n*   **Puma Suede Classic** - Puma: Giày da lộn cổ điển với vibe retro, siêu dễ phối đồ và tạo điểm nhấn cho outfit của bạn đó.\n\nBạn ưng em nào thì hú Footy nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 6601.025104522705, '2025-11-07 14:47:45.885583', 1),
(157, NULL, 'có giày puma không', 'Có luôn bạn ơi! ???? Footy có mẫu **Puma Suede Classic** cực xịn xò nè! Em này là sneakers da lộn timeless với vibe retro siêu cuốn hút, hiện có đủ size 36, 37 và hai màu Đen, Xanh dương đó ạ. ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 7778.7158489227295, '2025-11-07 14:48:15.361453', 1),
(158, NULL, 'tôi muốn giày nike nam', 'Được luôn bạn ơi! ???? Footy có mấy em giày Nike nam siêu chất cho bạn đây nè:\n\n*   **Nike Air Max 270**: Em này siêu thoải mái với đệm Air êm ái, diện đi chơi hay đi học hàng ngày đều ổn áp nha! ✨\n*   **Air-jordan**: Đây là mẫu giày \"ngon\" và đẳng cấp, cực kỳ phù hợp cho những ai đam mê sneaker thứ thiệt! ????\n\nBạn ưng em nào thì hú Footy nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 3246.6790676116943, '2025-11-07 14:48:57.082381', 1),
(159, NULL, 'có giày adidas nữ không', 'Chào bạn! Rất tiếc hiện tại Footy chưa có giày Adidas nào dành cho nữ bạn ơi. ????\n\nNhưng Footy đang có mấy em giày nữ siêu hot từ các hãng khác nè, ví dụ như **Vans Old Skool** và **Puma Suede Classic** cực xinh luôn đó! Bạn có muốn Footy tư vấn thêm không? ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6244.31848526001, '2025-11-07 14:49:39.513925', 1),
(160, NULL, '\"tìm giày dưới 1 triệu', 'Chào bạn! Dưới 1 triệu thì Footy có nhiều em xinh xắn và chất lượng lắm luôn nè! ✨ Bạn tham khảo mấy mẫu này nha:\n\n*   Converse Chuck Taylor High\n*   Vans Old Skool\n*   Puma Suede Classic\n*   Adidas Ultraboost 5.0\n*   Nike Air Max 270', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 7420.511245727539, '2025-11-07 14:50:03.061193', 1),
(161, NULL, 'cho tôi xem giày size 42', 'Chào bạn! Rất tiếc hiện tại Footy chưa có giày size 42 bạn ơi. ????\n\nBạn có muốn Footy gợi ý các size khác hoặc tìm giày theo tiêu chí nào khác không nè? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 5737.970590591431, '2025-11-07 14:50:18.315473', 1),
(162, NULL, 'có giày màu đen không', 'Hellooo! Footy có nhiều em giày màu đen siêu chất luôn nha bạn ơi! ???? Bạn tham khảo mấy em dưới đây nha! ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 3309.0360164642334, '2025-11-07 14:50:30.002244', 1),
(163, NULL, 'bạn gợi ý cho tôi vài đôi giày đi', 'Được thui bạn iu! Footy có mấy em xinh xỉu này muốn recommend cho bạn nè: ✨\n\n*   **Converse Chuck Taylor High**: Em này thì khỏi phải bàn rồi, basic mà cân mọi outfit luôn đó!\n*   **Nike Air Max 270**: Nếu bạn mê sự thoải mái, êm ái cho cả ngày dài thì phải thử em này liền nha.\n*   **Vans Old Skool**: Phong cách streetwear cá tính, năng động là chuẩn bài với em này luôn!\n\nBạn check mấy em này xem sao nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6705882352941177, 6761.162519454956, '2025-11-07 14:51:03.435933', 1),
(164, NULL, 'có gợi ý gì không', 'Chắc chắn rùi bạn ơi! Footy có nhiều em xinh xỉu muốn gợi ý cho bạn đây nè! ✨ Đảm bảo vừa đẹp, vừa chất, vừa hợp nhiều phong cách luôn nhaaa:\n\n*   **Converse Chuck Taylor High:** Chuẩn \"must-have\" luôn á! Đôi này classic mà phối đồ gì cũng đỉnh, hack dáng đỉnh chóp nữa! Có màu đen basic siêu dễ mang luôn.\n*   **Nike Air Max 270:** Nếu bạn mê sự thoải mái, êm ái thì em này là chân ái đó! Đi học, đi chơi cả ngày cũng không lo đau chân. Màu đen hoặc trắng đều xinh xỉu!\n*   **Adidas Ultraboost 5.0:** Team mê gym, chạy bộ thì không thể bỏ qua em này! Đệm siêu êm, hỗ trợ tốt mà form cũng siêu tôn chân nữa. Có màu đen và xám cool ngầu nha.\n*   **Vans Old Skool:** Cá tính một chút thì \"em\" này là lựa chọn không thể bỏ qua. Phong cách street style cực đỉnh, mang vào là auto ngầu liền! Cũng có màu đen lun đó!\n\nBạn muốn Footy tư vấn kĩ hơn về em nào không? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 13844.616651535034, '2025-11-07 14:51:36.062397', 1),
(165, NULL, 'giày nào tốt', 'Chắc chắn rùi bạn ơi! \"Tốt\" ở đây là theo gu nào của bạn ta? ???? Footy có mấy em xinh xỉu và chất lượng khỏi bàn luôn nè:\n\n*   **Converse Chuck Taylor High:** Vừa classic, dễ phối đồ lại còn bền bỉ, ai cũng mê! ????????\n*   **Adidas Ultraboost 5.0:** Nếu bạn mê tốc độ và sự êm ái khi chạy bộ thì em này đỉnh của chóp luôn đó, siêu thoải mái luôn! ✨\n*   **Nike Air Max 270:** Đôi này thì nổi tiếng về độ êm chân và siêu thoải mái cho cả ngày dài, phong cách lại năng động nữa! ????\n\nBạn thích phong cách nào hơn nè? Hay muốn ưu tiên về độ bền, hiệu suất hay sự thoải mái? Kể Footy nghe nha! ????', 'product_search', 'message', '{\"sentiment\": \"positive\", \"confidence\": 0.3333333333333333, \"is_urgent\": false, \"positive_words\": 1, \"negative_words\": 0, \"sentiment_score\": 1.0}', 0.7, 7501.230001449585, '2025-11-07 14:53:41.238170', 1),
(166, NULL, 'giày nào bán chạy', 'Ố là la, về độ bán chạy thì chắc chắn phải kể đến em **Converse Chuck Taylor High** rùi bạn ơi! Em này được lòng dân tình cực kỳ luôn đó, best-seller nhà mình á! ✨ Ngoài ra, mấy em như **Vans Old Skool** và **Puma Suede Classic** cũng được săn đón ghê lắm đó nha!', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 5004.904985427856, '2025-11-07 14:53:55.990773', 1),
(167, NULL, 'recommend cho tôi vài đôi', 'Ỏ keee luôn bạn iu! Để Footy recommend cho bạn vài đôi \"must-try\" ở FootFashion nha, đảm bảo không làm bạn thất vọng đâuuu! ✨\n\n*   **Converse Chuck Taylor High:** Em này là \"best-seller\" bên mình đó! Kiểu dáng classic không bao giờ lỗi thời, diện đồ gì cũng hợp, siêu hack dáng luôn! ????\n*   **Nike Air Max 270:** Nếu bạn mê sự thoải mái thì \"em nó\" là chân ái đó! Đệm Air siêu êm ái, đi cả ngày không lo mỏi chân, nhìn cũng trendy lắm nha. ☁️\n*   **Vans Old Skool:** Fans của phong cách streetwear cá tính thì không thể bỏ qua em này! Thiết kế basic nhưng cực chất, mix đồ đỉnh của chóp luôn đó. ????\n\nBạn thích phong cách nào hơn hay muốn tìm giày cho dịp gì không? Kể Footy nghe để mình gợi ý chuẩn hơn nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 8508.957147598267, '2025-11-07 14:54:15.443845', 1),
(168, NULL, 'oke cho tôi xem một vài đôi giày thương hiệu nike đi', 'Ó keee bạn iu! Để Footy show bạn vài em \"chất lừ\" nhà Nike nhaaa ✨\n\nĐầu tiên là em **Nike Air Max 270** nè, đôi này siêu thoải mái với đệm Air êm ái, diện đi đâu cũng đỉnh! Tiếp theo là em **Air-jodan** huyền thoại, đúng chuẩn \"giày ngon\" luôn đó bạn!\n\nBạn muốn Footy tư vấn thêm về đôi nào không nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3976.9647121429443, '2025-11-07 14:54:49.833188', 1),
(169, NULL, 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Có nhaaa! ✨ Hệ thống sẽ tự động hiển thị hình ảnh của hai em Nike siêu hot này ngay bên dưới luôn đó bạn! ????\n\nĐầu tiên là **Nike Air Max 270** nha, siêu thoải mái với đệm Air êm ái, hợp cho đi daily luôn.\nKế đến là em **Air-jordan**, đúng chuẩn \"giày ngon\" luôn đó! Cực phẩm cho các fan sneaker. ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7555555555555555, 6777.921915054321, '2025-11-07 14:55:06.451847', 1),
(170, NULL, 'Có', 'Đã có ngay đây rùi nha bạn iu! ✨ Check ngay bên dưới để chiêm ngưỡng 2 em nó nhaaa!', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 7235.936164855957, '2025-11-07 14:55:26.142658', 1),
(171, NULL, 'bạn gợi ý cho tôi vài đôi giày đi', 'Được thui bạn iu! Footy có mấy em xinh xỉu này muốn recommend cho bạn nè: ✨\n\n*   **Converse Chuck Taylor High**: Em này thì khỏi phải bàn rồi, basic mà cân mọi outfit luôn đó!\n*   **Nike Air Max 270**: Nếu bạn mê sự thoải mái, êm ái cho cả ngày dài thì phải thử em này liền nha.\n*   **Vans Old Skool**: Phong cách streetwear cá tính, năng động là chuẩn bài với em này luôn!\n\nBạn check mấy em này xem sao nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6705882352941177, 28.522968292236328, '2025-11-07 14:55:38.742328', 1),
(172, NULL, 'cho tôi xem hình ảnh', 'Có nha bạn iu! ✨ Hệ thống sẽ tự động hiển thị sản phẩm bên dưới cho bạn luôn đó! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3863.8522624969482, '2025-11-07 14:55:52.466002', 1),
(173, NULL, 'oke cho tôi xem một vài đôi giày thương hiệu nike đi', 'Oke bạn ơi, nhà FootFashion có 2 em Nike siêu hot này nha:\n- **Nike Air Max 270**: Đôi này siêu thoải mái, có đệm Air xịn sò, đi hàng ngày là hết nước chấm luôn.\n- **Air-jodan**: Em này thì chất lừ, đúng kiểu \"giày ngon\" luôn đó, cực đỉnh nha.\n\nBạn xem ưng em nào thì hú tui nha! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 4730.255126953125, '2025-11-07 15:03:52.825987', 1),
(174, NULL, 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Oke bạn ơi, hình ảnh 2 em nó đây nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7555555555555555, 8974.74479675293, '2025-11-07 15:04:12.509023', 1),
(175, NULL, 'bạn gợi ý cho tôi vài đôi giày đi', 'Oke la bạn ơi! Để Footy gợi ý liền cho bạn vài em siêu hot hit tại FootFashion nha! ????\n\nNếu bạn vẫn mê Nike thì em **Nike Air Max 270** này vẫn là chân ái với độ thoải mái đỉnh cao. Ngoài ra, bạn có thể tham khảo thêm:\n\n*   **Converse Chuck Taylor High**: Một em classic không bao giờ lỗi mốt, siêu dễ phối đồ luôn đó!\n*   **Vans Old Skool**: Iconic của dân mê trượt ván, cực bền và có vibe cool ngầu.\n*   **Adidas Ultraboost 5.0**: Nếu bạn thích sự êm ái và hiệu suất cao cho việc đi lại hàng ngày hay tập luyện thì em này là đỉnh của chóp luôn nha.\n\nBạn thấy ưng em nào không nè? Hay bạn có tiêu chí gì khác không để Footy gợi ý thêm cho chuẩn gu bạn luôn nè! ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6705882352941177, 5959.596872329712, '2025-11-07 15:04:31.663704', 1),
(176, NULL, 'cho tôi xem hình ảnh', 'Dạ đây liền nha bạn ơi! ✨ Ảnh của mấy em siêu hot hit Footy vừa gợi ý ở dưới nha ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 8319.923400878906, '2025-11-07 15:04:47.148968', 1),
(177, NULL, 'oke cho tôi xem một vài đôi giày thương hiệu nike đi\"', 'Chào bạn! ✨ Nike á, quá đỉnh luôn! FootFashion có mấy em này đang hot hit của Nike nè:\n\n*   **Nike Air Max 270:** Đôi này siêu thoải mái, có đệm Air cực êm ái cho outfit hàng ngày của bạn đó. Có các size 36, 37, 38 và màu Black, White nha.\n*   **Air-jodan:** Em này thì đúng là \"giày ngon\" luôn! Có size 38, 39 và màu Blue, Brown nha.\n\nBạn muốn tìm hiểu thêm về em nào không nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3746.295690536499, '2025-11-07 15:11:46.008694', 1),
(178, NULL, 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Được luôn bạn ơi! Đây là hình ảnh của 2 em Nike đó nha ????✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7555555555555555, 4822.232723236084, '2025-11-07 15:11:59.783628', 1),
(179, NULL, 'bạn gợi ý cho tôi vài đôi giày đi', 'Oke la bạn! ???? Đang tìm kiếm mấy đôi \"ngon nghẻ\" thì FootFashion có nhiều lựa chọn hay ho lắm nè!\n\nNếu bạn vẫn mê Nike thì có em **Nike Air Max 270** cực kỳ êm ái, đi hàng ngày là bao phê. Còn nếu bạn muốn đổi gió sang phong cách classic hơn thì **Converse Chuck Taylor High** luôn là chân ái không bao giờ lỗi mốt. Hoặc nếu thích sự thoải mái tối đa cho hoạt động thể thao thì **Adidas Ultraboost 5.0** là đỉnh của chóp luôn đó! ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6705882352941177, 7936.749219894409, '2025-11-07 15:12:30.301078', 1),
(180, NULL, 'cho tôi xem hình ảnh', 'Được luôn bạn! ✨ Để Footy show ảnh mấy đôi \"ngon nghẻ\" vừa gợi ý nha!', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 10627.006530761719, '2025-11-07 15:12:58.271180', 1),
(181, NULL, 'oke cho tôi xem một vài đôi giày thương hiệu nike đi', 'Chào bạn! ???? Bên mình có mấy em Nike siêu hot luôn nè:\n\n*   **Nike Air Max 270:** Đôi này siêu thoải mái với đệm Air êm ái, hợp mang hàng ngày luôn. Có size 36, 37, 38, màu đen và trắng. Giá chỉ 10.000 VND.\n*   **Air-jodan:** Em này thì chất khỏi bàn rồi, hàng hiếm đó nha! Có size 38, 39, màu xanh và nâu. Giá 12.300.000 VND.\n\nBạn muốn tìm hiểu thêm về đôi nào không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 14538.28239440918, '2025-11-07 15:17:48.536608', 1),
(182, NULL, 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Dạ đây ạ! Mời bạn xem hình ảnh chi tiết của mấy em Nike này nha. ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7555555555555555, 9647.716283798218, '2025-11-07 15:18:09.011947', 1),
(183, NULL, 'oke cho tôi xem một vài đôi giày thương hiệu nike đi', 'Chào bạn! Footy có ngay mấy đôi Nike xịn xò cho bạn đây nè ????\n\nĐầu tiên là **Nike Air Max 270** với đệm Air êm ái, siêu phù hợp cho daily wear luôn. ????\nTiếp theo là em **Air-Jordan** đình đám, đúng chuẩn \'giày ngon\' luôn đó! Màu xanh và nâu cực chất. ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 5660.2582931518555, '2025-11-07 15:24:41.243944', 1),
(184, NULL, 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Được luôn nè bạn ơi! Ảnh mấy em ấy ở ngay dưới đây nha ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7555555555555555, 7547.836780548096, '2025-11-07 15:24:59.604769', 1),
(185, NULL, 'gợi ý cho mình đôi thương hiệu nike', 'Chào bạn! ???? Footy hiểu bạn đang tìm giày Nike đúng không nè? Bên mình có hai em Nike cực chất đây:\n\n1.  **Nike Air Max 270:** Em này siêu thoải mái với đệm Air êm ái, hợp mang hàng ngày luôn đó.\n2.  **Air-jodan:** Một đôi giày \"ngon\" đúng nghĩa, vừa chất vừa đẳng cấp luôn nha.\n\nBạn muốn tìm hiểu thêm về em nào không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 4825.033187866211, '2025-11-07 15:38:30.974083', 1),
(186, NULL, 'bạn có link sản phẩm 2 đôi này không gửi mình xem', 'Oke la luôn bạn ơi! ✨ Bạn click vào link bên dưới để xem chi tiết em Nike Air Max 270 và Air-jordan nhé! Hệ thống sẽ tự động gửi link cho bạn nè. ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 4032.5675010681152, '2025-11-07 15:38:53.212163', 1),
(187, NULL, 'gợi ý cho tôi một đôi giày thương hiệu nike', 'Footy đây! ???? Bạn đang tìm giày Nike phải không nè? FootFashion có 2 em Nike cực đỉnh luôn:\n\n1.  **Nike Air Max 270**: Em này giá chỉ 10,000 VND thôi, siêu êm ái với đệm Air, cực hợp cho đi lại hằng ngày. Có size Nam từ 36-38 và hai màu Black, White nha. Em này bán được 10 đôi rồi đó!\n2.  **Air-jodan**: Nghe tên là thấy \"giày ngon\" rồi đúng không? Giá em nó là 12,300,000 VND, dành cho Nam, có size 38, 39 với hai màu Blue, Brown cực chất. Em này mới về nên hơi hiếm đó, mới bán được 1 đôi à! ????\n\nBạn ưng em nào thì hú Footy nhé!', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 5056.811332702637, '2025-11-07 15:46:16.362079', 1),
(188, NULL, 'oke cho tôi xin đường link sản phẩm', 'Dạ đây ạ! ✨ Bạn click vào link bên dưới để xem chi tiết về hai em Nike Air Max 270 và Air-jordan xịn xò nha! ????', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 4190.370082855225, '2025-11-07 15:46:35.376213', 1),
(189, NULL, 'bạn có thể gợi ý cho tôi đôi giày thương hiệu nike không', 'Chào bạn! Footy có ngay vài em Nike cực chất cho bạn đây nè! ✨\n\n*   **Nike Air Max 270:** Đôi này siêu thoải mái với đệm Air êm ái, hợp mang đi học, đi chơi mỗi ngày luôn á. Giá chỉ 10,000 VND thôi.\n*   **Air-jodan:** Nếu bạn tìm một item đẳng cấp hơn thì Air-jodan là lựa chọn không thể bỏ qua, thiết kế siêu ngầu và chất lượng khỏi bàn. Giá 12,300,000 VND nha.\n\nBạn muốn tìm hiểu thêm về đôi nào không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 5170.772552490234, '2025-11-07 15:55:46.044540', 1);
INSERT INTO `core_chatbotconversation` (`id`, `session_id`, `message`, `response`, `intent`, `response_type`, `sentiment`, `confidence_score`, `processing_time`, `created_at`, `user_id`) VALUES
(190, NULL, 'oke vậy bạn có link sản phẩm đó không', 'Oke la bạn ơi! Link của mấy em Nike Air Max 270 và Air-jordan xịn sò Footy vừa gợi ý đây nha. Bạn cứ click vào để xem hình ảnh và thông tin chi tiết nha! ????\n\n???? Link sản phẩm:\n1. Nike Air Max 270: http://localhost:3000/product/14\n2. Air-jodan: http://localhost:3000/product/26\n', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 6144.107341766357, '2025-11-07 15:56:15.077936', 1),
(191, NULL, 'bạn có thể gợi ý cho tôi đôi giày thương hiệu nike không', 'Chào bạn! Footy có ngay mấy đôi Nike xịn sò để bạn tham khảo nè ✨:\n\n*   **Nike Air Max 270**: Em này siêu thoải mái với đệm Air êm ái, hợp cho đi lại hàng ngày lắm đó. Giá chỉ 10.000 VND.\n*   **Air-jodan**: Mẫu này thì khỏi bàn rồi, \"giày ngon\" đỉnh của chóp, với giá 12.300.000 VND.\n\nBạn muốn xem chi tiết đôi nào không? Hay có tiêu chí gì khác không nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3858.0777645111084, '2025-11-07 16:02:25.128666', 1),
(192, NULL, 'bạn có đường link sản phẩm không cho mình xem sản phẩm được không ạ', 'Chào bạn! Footy hiểu bạn muốn xem sản phẩm để dễ hình dung hơn nè ????. Bạn cứ yên tâm nha, các link sản phẩm sẽ được hệ thống tự động thêm vào cuối câu trả lời này đó.\n\nNhư mình đã gợi ý ở trên, Footy có 2 đôi Nike này siêu hot luôn:\n\n*   **Nike Air Max 270:** Êm ái, thoải mái cho cả ngày dài, có các size 36, 37, 38 và màu Black, White.\n*   **Nike Air-jordan:** Đôi này \"ngon\" khỏi bàn, có size 38, 39 và màu Blue, Brown nha.\n\nBạn cứ click vào link bên dưới để xem chi tiết từng đôi nhé! ✨\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 2558.1085681915283, '2025-11-07 16:02:48.617371', 1),
(193, NULL, 'bên bạn còn có thương hiệu nào khác không', 'Ngoài Nike xịn sò Footy vừa giới thiệu, FootFashion còn có nhiều thương hiệu nổi tiếng khác nữa đó bạn! ✨ Bạn có thể tham khảo thêm các hãng như **Converse, Vans, Puma** và **Adidas** nè. Bạn muốn tìm hiểu về hãng nào cụ thể không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2525.0113010406494, '2025-11-07 16:03:26.674063', 1),
(194, NULL, 'oke bạn cho tôi xem những đôi giày hãng puma xem', 'Oke la bạn iu! Footy có ngay đây nè. Với nhà Puma, FootFashion đang có em **Puma Suede Classic** cực chất luôn! ✨\n\nEm này là kiểu sneakers da lộn kinh điển, mang vibe retro cực cuốn hút. Giá siêu hạt dẻ chỉ 100.000 VND thôi nè. Puma Suede Classic dành cho các bạn nữ, có đủ size 36, 37 và hai màu Black, Blue cá tính để bạn chọn lựa nha. Em này bán chạy lắm rồi, 13 đôi đã tìm được chủ mới đó! ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.11428571428571428, 4834.702730178833, '2025-11-07 16:03:49.269837', 1),
(195, NULL, 'cho mình đường link sản phẩm để mình xem đôi giày được không', 'Oke bạn ơi! Footy gửi ngay link của em **Puma Suede Classic** dưới đây nha. Bạn click vào để xem chi tiết sản phẩm nha! ????\n\n???? Link sản phẩm:\n1. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2811.9165897369385, '2025-11-07 16:04:26.791369', 1),
(196, NULL, 'Có khuyến mãi nào không?', 'Oke la bạn iu! Footy có mấy ưu đãi siêu hời dành cho bạn đây nè:\n\n*   **Mã: Giam50** ✨ Giảm tới 50% lận đó, áp dụng đến 12/12/2025.\n*   **Mã: FreeShip** ???? Giảm 20% và còn được freeship nữa, áp dụng đến 30/12/2025.\n*   **Mã: Giam10k** ???? Giảm 10% nha, mã này hết hạn sớm hơn chút vào 29/11/2025 á.\n\nBạn tranh thủ dùng liền nha, deal hời không đợi ai đâu! ????\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6, 4172.902584075928, '2025-11-07 16:04:40.349321', 1),
(197, NULL, 'Gợi ý giày thể thao', 'Oke la bạn iu! ???? Footy hiểu liền là bạn đang tìm giày thể thao xịn xò đây mà! Footy có vài gợi ý siêu chất cho bạn nè:\n\n*   **Adidas Ultraboost 5.0**: Em này đỉnh của chóp cho mấy bạn mê chạy bộ hoặc cần sự êm ái tối đa đó. Đệm siêu phản hồi, mang cực sướng luôn!\n*   **Nike Air Max 270**: Nếu bạn thích sự thoải mái, êm ái để đi hàng ngày hay tập luyện nhẹ nhàng thì em này là lựa chọn không thể bỏ qua, có đệm Air siêu xịn sò luôn đó!\n*   **Air-jodan**: Hoặc nếu bạn muốn một đôi cực kỳ iconic và đẳng cấp, mang đậm chất thể thao đường phố thì Air-jodan là chân ái luôn đó! ✨\n\nBạn click vào link để xem chi tiết từng em nha!', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 7721.62389755249, '2025-11-07 16:05:01.633978', 1),
(198, NULL, 'cho mình xin link những đôi ở trên đi', 'Oke la bạn iu! ???? Footy hiểu liền nè! Các link sản phẩm sẽ được hệ thống \"auto\" thêm ngay phía dưới nha, bạn cứ thoải mái click để xem chi tiết từng em nha! ????\n\n⚠️ Hiện tại không tìm thấy sản phẩm phù hợp. Bạn có thể thử tìm kiếm với từ khóa cụ thể hơn nhé!', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2448.9991664886475, '2025-11-07 16:05:19.901651', 1),
(199, NULL, 'Giúp tôi', 'Oke la bạn iu! ???? Footy luôn sẵn sàng giúp đỡ bạn hết mình nha! ✨ Bạn đang muốn Footy gợi ý thêm về giày thể thao, hay có câu hỏi nào khác không nè? Cứ nói Footy nghe nha! ????', 'help', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6, 6429.0220737457275, '2025-11-07 16:05:41.115527', 1),
(200, NULL, 'cho tôi link sản phẩm đôi adidas xem nào', 'Oke liền nha bạn ơi! ✨ Link của đôi Adidas Ultraboost 5.0 sẽ được hệ thống \"auto\" gửi tới bạn ngay đây nè! Bạn xem nha! ????\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.1959183673469388, 3948.5485553741455, '2025-11-07 16:06:01.412730', 1),
(201, NULL, 'hi', 'Hellooo! ???? Footy đây, bạn cần tìm giày gì nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2482.1712970733643, '2025-11-08 06:23:42.843929', 1),
(202, NULL, 'bạn có thểông gợi ý một số đôi giày cho tôi được kh', 'Chào bạn! Rất vui được gợi ý nha! ✨ Footy có mấy em siêu hot hit mà ai cũng mê nè:\n\n*   **Converse Chuck Taylor High:** Đỉnh của chóp luôn, classic không bao giờ lỗi mốt, diện kiểu gì cũng hợp từ đi học, đi chơi luôn đó.\n*   **Vans Old Skool:** Em này thì cá tính khỏi bàn, kiểu dáng skate đậm chất đường phố, cực ngầu cho các bạn nữ.\n*   Hoặc nếu bạn thích sự thoải mái, êm ái cho cả ngày dài thì **Nike Air Max 270** là lựa chọn tuyệt vời đó, có đệm Air siêu xịn!\n\nBạn thích style nào trong mấy em này không? Hay bạn có tiêu chí gì khác không để Footy gợi ý thêm nha! ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.06666666666666665, 5344.334602355957, '2025-11-08 06:24:08.159878', 1),
(203, NULL, 'Cho tôi đường link sản phẩm converse để tôi xem sản phẩm được không', 'Aww bạn muốn xem chi tiết em **Converse Chuck Taylor High** phải không nè? ???? Em này đúng chuẩn \"classic high-top sneakers\" với thiết kế không bao giờ lỗi thời luôn đó! Bạn click vào link bên dưới để xem tất tần tật về em nó nha! ????\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2981.788396835327, '2025-11-08 06:24:49.991679', 1),
(204, NULL, 'oke giờ tôi đang đi học thì nên cần lấy đôi giày gì để đi học nhể', 'Oki bạn! Đi học thì cần đôi nào vừa thoải mái mà vẫn cool ngầu đúng không nè? ????\n\nFooty thấy em **Converse Chuck Taylor High** mà bạn vừa hỏi cực kỳ hợp luôn đó! Vừa basic, dễ phối đồ mà lại bền nữa. Bao nhiêu thế hệ học sinh đều mê em này hết đó!\n\nNgoài ra, bạn có thể tham khảo thêm em **Nike Air Max 270** nha. Đôi này êm ái, nhẹ nhàng, đi cả ngày không mỏi chân đâu nè! Chuẩn vibe năng động cho đi học luôn đó. ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 5614.513635635376, '2025-11-08 06:25:24.082527', 1),
(205, NULL, 'OKe cho tôi xin đường link đôi nike air max 270 với', 'Oki bạn yêu! ???? **Nike Air Max 270** là chuẩn bài luôn đó, cực kỳ thoải mái với đệm khí Air siêu êm ái, diện đi học hay đi chơi đều đỉnh nè! ✨ Bạn xem chi tiết qua link bên dưới nhé! ????\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.12075471698113208, 2817.2523975372314, '2025-11-08 06:26:01.007077', 1),
(206, NULL, 'Tôi muốn mua giày Nike', 'Chào bạn! Footy đây ???? Bạn tìm giày Nike à? Bên mình có 2 mẫu hot hit này nè:\n\n*   **Nike Air Max 270**: Em này siêu thoải mái với đệm Air êm ái, rất hợp để diện mỗi ngày đó. Giá chỉ 10,000 VND, có đủ size nam từ 36-38 với màu đen và trắng.\n*   **Air-jodan**: \"Giày ngon\" đúng như mô tả luôn, em này đẳng cấp khỏi bàn! Giá 12,300,000 VND, có cho nam, size 38, 39 với màu xanh và nâu.\n\nBạn ưng em nào không? ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7783783783783784, 4187.271356582642, '2025-11-08 07:15:44.186045', 1),
(207, NULL, 'oke nè he he giày hông?', 'Để em tìm được giày phù hợp nhất, bạn có thể cho em biết thêm về thương hiệu (Nike, Adidas, Puma, Vans, Converse) và giới tính (Nam, Nữ, Unisex) không ạ? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.15, 21.448373794555664, '2025-11-08 08:06:20.342888', 3),
(208, NULL, 'Cho hỏi chính sách đổi trả', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 14.211177825927734, '2025-11-08 08:06:57.027814', 3),
(209, NULL, 'Giá giày nike air bao nhiêu', 'Okeee, có giày luôn nè bạn ơi! ????\n\nHiện tại, FootFashion có 2 mẫu giày Nike có \"Air\" trong tên sản phẩm với giá như sau nè:\n*   **Nike Air Max 270** có giá là **2,580,000 VND**.\n*   **Air-jordan** thì có giá là **12,300,000 VND**.\n\nBạn ưng mẫu nào để mình tư vấn thêm nha! ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 4772.449016571045, '2025-11-08 08:07:23.192560', 3),
(210, NULL, 'cho tôi xin link hai đôi giày nike này', 'Dạ đây nha bạn ơi! Hai đôi Nike xịn xò này có link ở dưới đó, bạn click vào để xem chi tiết nha! ????\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.14545454545454548, 4572.312593460083, '2025-11-08 08:07:49.350267', 3),
(211, NULL, 'hello', 'Hello bạn! Footy đây ???? Bạn muốn tìm hiểu thêm về mấy đôi Nike hôm trước mình vừa giới thiệu không nè? Hay bạn có câu hỏi gì khác hông? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3711.0602855682373, '2025-11-08 08:17:57.994361', 1),
(212, NULL, 'tôi cần tìm đôi giày thương hiệu nike', 'Footy đây! ???? Bạn tìm giày Nike đúng không nè? ???? Footy có 2 em này cực chất luôn:\n\n*   **Nike Air Max 270** - Giá 2.580.000 VND. Em này siêu thoải mái, có đệm khí Air xịn sò đi everyday là chuẩn bài luôn. ✨\n*   **Air-jodan** - Giá 12.300.000 VND. Đôi này thì \"giày ngon\" khỏi phải bàn rồi! ????\n\nBạn ưng em nào để Footy tư vấn thêm nha!', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 4246.488809585571, '2025-11-08 08:18:16.620348', 1),
(213, NULL, 'cho tôi xin link sản phẩm 2 đôi nike này', 'Okela bạn ơi! ✨ Link của 2 em Nike Air Max 270 và Air-jodan sẽ hiện ra ngay bên dưới nha. Bạn click vào để xem chi tiết sản phẩm nha! ????\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.13617021276595745, 3927.642345428467, '2025-11-08 08:18:58.006146', 1),
(214, NULL, 'bạn có thể mô tả chi tiết rõ cho mình đôi NIke Air Max 270 được không', 'Được thôi bạn ơi! ✨ Để Footy mô tả chi tiết em Nike Air Max 270 này cho bạn nha!\n\nEm này đúng là \"đỉnh của chóp\" về độ thoải mái luôn đó! Với công nghệ đệm khí Air siêu êm ái, to oạch ở gót, đảm bảo bạn đi bộ cả ngày mà vẫn cứ \"nhẹ tênh\" không lo mỏi chân. Kiểu dáng hiện đại, năng động, cực dễ mix & match với mọi outfit từ đi học, đi làm đến đi chơi nha. ????\n\nVề thông tin cụ thể:\n*   **Giá:** 2.580.000 VND\n*   **Giới tính:** Nam\n*   **Sizes:** 36, 37, 38\n*   **Màu sắc:** Đen, Xanh\n\nEm nó đã bán được 10 đôi rồi đó, nên bạn yên tâm về độ hot nha! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6476.357936859131, '2025-11-08 08:20:23.220049', 1),
(215, NULL, 'bạn có thể so sánh đôi Nike air Max 270 với Air Jodan được không', 'Chào bạn! ✨ Footy sẵn sàng so sánh 2 em Nike Air Max 270 và Air-jodan này cho bạn nè!\n\n*   **Nike Air Max 270:** Em này siêu đỉnh về độ thoải mái và êm ái nhờ công nghệ Air cushioning đó bạn. Rất phù hợp cho những bạn thích diện giày hàng ngày, đi lại nhiều mà vẫn cần sự năng động. Giá em nó cũng \"dễ chịu\" hơn một chút, chỉ 2.580.000 VND thôi. Hiện đang có đủ size từ 36-38 với 2 màu đen và xanh cá tính.\n\n*   **Air-jodan:** Còn Air-jodan thì đúng là một \"siêu phẩm\" với mức giá khá cao, 12.300.000 VND, thường được các tín đồ sneaker săn đón vì sự độc đáo và mang đậm phong cách riêng. Dù được mô tả ngắn gọn là \"giày ngon\" nhưng em này chắc chắn sẽ làm bạn nổi bật và thể hiện cá tính cực mạnh. Hiện có sẵn size 38-39 với 2 màu xanh và nâu nha.\n\nTóm lại, nếu bạn ưu tiên sự thoải mái, êm ái để đi lại hàng ngày với mức giá phải chăng thì Air Max 270 là lựa chọn tuyệt vời. Còn nếu bạn muốn một em giày cực chất, độc đáo và sẵn sàng chi mạnh để thể hiện phong cách thì Air-jodan sẽ không làm bạn thất vọng đâu! ????\n\nBạn muốn Footy tư vấn thêm về em nào không nè?\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.09142857142857143, 8617.606163024902, '2025-11-08 08:21:44.417252', 1),
(216, NULL, 'hi', 'Helloooo! ???? Footy đây, có gì Footy giúp bạn chọn được đôi giày ưng ý không nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 4468.093156814575, '2025-11-13 14:04:53.311700', 1),
(217, NULL, 'hi', 'Helloooo! ???? Footy đây, có gì Footy giúp bạn chọn được đôi giày ưng ý không nè? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3.527402877807617, '2025-11-13 14:52:27.787401', 3),
(218, NULL, 'hello bên shop mình bán gì nhể', 'Chào bạn! FootFashion tụi mình chuyên bán các loại giày sneaker xịn xò từ các hãng như Converse, Vans, Puma, Adidas, Nike nè ✨.\n\nBạn đang tìm giày cho nam hay nữ, hay có style nào đặc biệt không? Để mình tư vấn cho dễ nha ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3905.782699584961, '2025-11-14 08:52:30.264502', 1),
(219, NULL, 'hello', 'Chào bạn! Mình là Footy, trợ lý mua sắm AI của FootFashion đây ✨. Bạn đang tìm kiếm mẫu giày nào nè? Kể cho mình nghe nhé!', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 4997.416257858276, '2025-11-14 09:05:17.134667', 1),
(220, NULL, 'Có khuyến mãi nào không?', 'Yesss, FootFashion đang có nhiều ưu đãi hot hit luôn nè bạn! ✨ Bạn có thể dùng mã **Giam50** để được giảm 50% (hết 12/12/2025), mã **FreeShip** giảm 20% (hết 30/12/2025) hoặc mã **Giam10k** giảm 10% (hết 29/11/2025) nha. Mấy mã này có hạn dùng đến cuối năm lận, tranh thủ shopping liền thôiii! ????️', 'promotion', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 6677.971601486206, '2025-11-14 09:05:29.862303', 1),
(221, NULL, 'Gợi ý giày thể thao', 'Chào bạn! Nếu bạn tìm giày thể thao để chạy bộ thì Adidas Ultraboost 5.0 là lựa chọn cực xịn đó nha! Em này có đệm siêu êm, hỗ trợ tối đa cho việc chạy, giá chỉ 100k thui ✨.\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'recommendation', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 8404.802560806274, '2025-11-14 09:05:47.790033', 1),
(222, NULL, 'Giúp tôi', 'Footy đây ạ! Bạn muốn mình giúp gì thêm nè? Liệu bạn có muốn xem thêm các mẫu giày thể thao khác, hay đang tìm một kiểu giày mới ạ? ✨', 'help', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 4540.054559707642, '2025-11-14 09:05:57.780323', 1),
(223, NULL, 'tôi đang cần tìm kiếm một đôi giày thương hiệu nike', 'Chào bạn, Footy có 2 mẫu Nike cực đỉnh muốn giới thiệu ngay đây! ✨\n\nĐầu tiên là **Nike Air Max 270** giá 2.580.000 VND, siêu thoải mái với đệm Air xịn sò cho bạn đi lại cả ngày không mỏi. Thứ hai là **Air-jodan** với giá 12.300.000 VND, đôi này thì \"ngon\" khỏi bàn rồi ạ! Bạn click link bên dưới để xem chi tiết nhé!', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 10485.27455329895, '2025-11-14 09:06:28.331670', 1),
(224, NULL, 'oke hãy cho tôi xin link đôi giày mà bạn vừa gợi ý được không ạ', 'Để em tìm được giày phù hợp nhất, bạn có thể cho em biết thêm về thương hiệu (Nike, Adidas, Puma, Vans, Converse) và giới tính (Nam, Nữ, Unisex) không ạ? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 0, '2025-11-14 09:06:59.537107', 1),
(225, NULL, 'Thương hiệu nike đi nhé', 'Okela bạn ơi! Như Footy đã định giới thiệu, mình có 2 mẫu Nike cực chất đây:\nĐầu tiên là Nike Air Max 270 giá 2.580.000 VND, siêu êm ái cho đi lại hằng ngày. Kế đến là Air-jodan, với giá 12.300.000 VND, cực phẩm cho dân mê sneaker luôn đó! Bạn click link bên dưới để xem chi tiết nhé! ✨\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n4. [Adidas Ultraboost 5.0](/product/15)\n5. [Nike Air Max 270](/product/14)\n', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 11194.791793823242, '2025-11-14 09:07:30.032498', 1),
(226, NULL, 'Shop có đôi sneaker nam dưới 500k không?', 'Hi bạn, Footy đã tìm được vài em sneaker nam dưới 500k cho bạn đây nè! ???? Tiếc là ở mức giá này, Footy chưa có mẫu Nike nào phù hợp cả.\n\nBạn có thể tham khảo **Converse Chuck Taylor High** hoặc **Adidas Ultraboost 5.0** nha, cả hai đều có giá siêu hạt dẻ chỉ **100k** thôi đó! Đều là hàng hot mà còn rẻ nữa.\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Adidas Ultraboost 5.0](/product/15)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 8078.07993888855, '2025-11-14 09:09:28.459991', 1),
(227, NULL, 'Giày này có chống nước không?', 'Để em tìm được giày phù hợp nhất, bạn có thể cho em biết thêm về thương hiệu (Nike, Adidas, Puma, Vans, Converse) và giới tính (Nam, Nữ, Unisex) không ạ? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 0, '2025-11-14 09:09:59.081874', 1),
(228, NULL, 'Size 40 còn hàng màu trắng không?', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 1.0192394256591797, '2025-11-14 09:10:13.283434', 1),
(229, NULL, 'Chào shop', 'Chào bạn! ???? FootFashion có thể giúp gì cho bạn hôm nay ạ? Bạn đang tìm mẫu giày nào hay muốn tham khảo sản phẩm mới bên mình không?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 4097.757816314697, '2025-11-14 09:36:38.356083', 1),
(230, NULL, 'Cho tôi xem giày Nike', 'Chào bạn! FootFashion hiện có hai mẫu Nike là **Nike Air Max 270** (2,580,000 VND) với đệm Air êm ái, có size 36-38 (Đen, Xanh) và **Air-jodan** (12,300,000 VND), mẫu giày \"ngon\" này có size 38, 39 (Xanh, Nâu) ạ. Bạn ưng mẫu nào để mình tư vấn thêm nhé! ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 5471.445798873901, '2025-11-14 09:37:09.676956', 1),
(231, NULL, 'Giày này chống nước không?', 'Bạn muốn tìm giày thương hiệu nào, hay để em gợi ý mấy đôi bán chạy nhất? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 0.4336833953857422, '2025-11-14 09:37:20.555046', 1),
(232, NULL, 'Size 40 còn hàng không?', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 0, '2025-11-14 09:37:30.723458', 1),
(233, NULL, 'Tôi cần đôi đi chạy bộ nhẹ nhẹ', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6, 0, '2025-11-14 09:37:39.555620', 1),
(234, NULL, 'Có mã giảm giá không?', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 1.0061264038085938, '2025-11-14 09:37:55.012280', 1),
(235, NULL, 'Có khuyến mãi nào không?', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6, 0, '2025-11-14 09:37:59.094662', 1),
(236, NULL, 'hello', 'Chào bạn, Footy đây! Mình có thể giúp gì cho bạn nè? Bạn đang tìm mẫu giày nào hay cần mình tư vấn gì không? ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 4286.907434463501, '2025-11-14 09:50:31.070097', 1),
(237, NULL, 'tôi cần tìm một đôi giày thương hiệu nike', 'Chào bạn! Footy có hai mẫu giày Nike đang rất hot đây nè:\n\n1.  **Nike Air Max 270**: Giá 2.580.000 VND, có đủ size 36, 37, 38 với hai màu Black và Blue. Đôi này cực kỳ thoải mái để đi hàng ngày luôn đó bạn.\n2.  **Air-jodan**: Giá 12.300.000 VND, có size 38, 39 với hai màu Blue và Brown. Đây là một lựa chọn tuyệt vời cho những ai tìm kiếm sự độc đáo và chất lượng.\n\nBạn thích mẫu nào hơn hay có cần tìm size nào không để mình tư vấn kỹ hơn nha!', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3955.6097984313965, '2025-11-14 09:50:53.926257', 1),
(238, NULL, 'có màu đen không', 'Vâng, Nike Air Max 270 có màu đen đó bạn! Bạn có muốn mình gửi thêm thông tin chi tiết về đôi này không?', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 11098.470687866211, '2025-11-14 09:51:20.396036', 1),
(239, NULL, 'size 40 còn không', 'Chào bạn! Rất tiếc là mẫu Nike Air Max 270 hiện tại bên Footy không còn size 40 rồi ạ, mẫu này chỉ có đến size 38 thôi.\n\nNếu bạn ưu tiên tìm giày size 40, Footy có một số mẫu Vans và Converse rất được ưa chuộng như Vans Slip-On Checkerboard, Vans Sk8-Hi Black White hay Converse All Star Lift Platform đều có size 40 đó ạ. Bạn có muốn Footy giới thiệu chi tiết hơn không?\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 17794.00372505188, '2025-11-14 09:51:50.160823', 1),
(240, NULL, 'tôi cần giày chạy bộ', 'Bạn muốn tìm giày thương hiệu nào, hay để em gợi ý mấy đôi bán chạy nhất? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 2.997159957885742, '2025-11-14 09:52:23.210437', 1),
(241, NULL, 'thương hiệu van', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 0, '2025-11-14 09:52:33.752778', 1),
(242, NULL, 'tôi cần một đôi giày để chạy bộ', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 0, '2025-11-14 09:53:01.201471', 1),
(243, NULL, 'tôi cần một đôi giày thương hiệu nike', 'Chào bạn! Bạn tìm giày chạy bộ của Nike đúng không ạ?\n\nShop mình có mẫu **Nike Air Max 270** rất êm ái, có đệm khí Air xịn sò, phù hợp cho đi lại hằng ngày hoặc chạy nhẹ đó ạ. Màu đen cũng có luôn nhé!\n\nBạn mang size bao nhiêu để mình kiểm tra xem còn hàng không nha?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 10922.625303268433, '2025-11-14 09:54:18.399869', 1),
(244, NULL, 'Giày này có chống nước không', 'Bạn muốn tìm giày thương hiệu nào, hay để em gợi ý mấy đôi bán chạy nhất? ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 0, '2025-11-14 09:54:28.697887', 1),
(245, NULL, 'size 40 còn hàng không', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 0, '2025-11-14 09:54:47.149545', 1),
(246, NULL, 'Tôi muốn đôi Nike, size 40, đi chạy bộ, nhẹ, màu trắng, giá dưới 3 triệu, còn hàng không?', 'Chào bạn! Hiện tại, Footy chưa có mẫu Nike nào size 40 màu trắng, dưới 3 triệu, phù hợp để chạy bộ và nhẹ như bạn tìm đâu ạ.\n\nVề khả năng chống nước, hầu hết các mẫu giày chạy bộ thường ưu tiên sự thoáng khí hơn nhé.\n\nMình có hai gợi ý khác cũng rất tốt cho việc chạy bộ, có size 40 và nhẹ đây:\n*   **Adidas Ultraboost Light**: Đôi này có đủ size 40, màu trắng, chạy cực êm và có chống nước nhẹ. Giá 3.900.000đ, hơi nhỉnh hơn chút so với mức bạn tìm.\n*   **Puma Velocity Nitro**: Giày này chuyên dụng cho chạy bộ, có size 40, giá chỉ 2.300.000đ. Màu sắc hiện có là xám bạn nhé.\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 15316.55216217041, '2025-11-14 09:57:51.628511', 1),
(247, NULL, 'Tôi cần một đôi giày Nike', 'Chào bạn! Footy đây ạ.\n\nBên mình có hai mẫu giày Nike rất được ưa chuộng là:\n\n1.  **Nike Air Max 270:** Giá 2.580.000đ, có các size 36, 37, 38, với hai màu Đen và Xanh. Đây là đôi sneakers cực kỳ thoải mái với đệm Air êm ái, rất hợp để đi lại hàng ngày đó ạ.\n2.  **Air-jordan:** Giá 12.300.000đ, có size 38, 39, màu Xanh và Nâu. Đây là một mẫu giày rất chất lượng và cá tính, cực kỳ được săn đón luôn ạ.\n\nBạn ưng mẫu nào hoặc có size/màu sắc yêu thích không để mình tư vấn kỹ hơn nhé?\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 8972.213745117188, '2025-11-14 10:23:41.817187', 1),
(248, NULL, 'Có màu trắng không?', 'Dạ hiện tại các mẫu Nike bên mình chưa có màu trắng ạ.\n\nNếu bạn thích giày màu trắng, Footy có mẫu **Converse Chuck Taylor High** đang có sẵn màu trắng rất đẹp đó ạ! Mẫu này là classic high-top, giá 100.000 VND và đang có đủ size 36, 37, 38 luôn ạ.\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n4. [Adidas Ultraboost 5.0](/product/15)\n5. [Nike Air Max 270](/product/14)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 6822.432994842529, '2025-11-14 10:24:26.918049', 1),
(249, NULL, 'Nó có chống nước không?', 'Chào bạn! Về khả năng chống nước thì:\n- Mẫu Nike Air Max 270 hiện chưa có tính năng này ạ.\n- Còn mẫu Air-jodan được làm từ da tổng hợp nên có thể hạn chế thấm nước một phần thôi bạn nhé.\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n4. [Adidas Ultraboost 5.0](/product/15)\n5. [Nike Air Max 270](/product/14)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 5280.972242355347, '2025-11-14 10:24:52.582518', 1),
(250, NULL, 'Size 40 còn hàng không?', 'Chào bạn! Về size 40 thì các mẫu Nike như Air Max 270 hay Air Jordan hiện chưa có hàng ạ.\n\nÀ nhưng nếu bạn đang tìm size 40, bên mình có sẵn các mẫu:\n- Vans Slip-On Checkerboard\n- Vans Sk8-Hi Black White\n- Converse All Star Lift Platform\n\nBạn muốn mình tư vấn thêm về mẫu nào không nè?\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n4. [Adidas Ultraboost 5.0](/product/15)\n5. [Nike Air Max 270](/product/14)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 7652.972459793091, '2025-11-14 10:25:21.316186', 1),
(251, NULL, 'Vậy tôi muốn đôi Nike, size 40, màu trắng, nhẹ, dưới 3 triệu — còn hàng không?', 'Chào bạn! Rất tiếc, Footy kiểm tra thì hiện tại shop chưa có mẫu Nike nào đáp ứng đủ các tiêu chí bạn muốn: size 40, màu trắng, nhẹ và có giá dưới 3 triệu ạ.\n\nMẫu Nike Air Max 270 thì nhẹ và giá dưới 3 triệu nhưng lại không có size 40 và cũng không có màu trắng bạn nhé. Các mẫu Nike khác cũng chưa có size 40.\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 15875.240325927734, '2025-11-14 10:25:54.970751', 1),
(252, NULL, 'bạn có thể so sánh hai đôi giày này coi đôi nào có ưu và nhược điểm hơn nhau không', 'Chào bạn! Để mình so sánh giúp bạn nha. Bạn muốn mình so sánh hai mẫu giày nào ạ?\n\nNếu bạn vẫn quan tâm các dòng của Nike, shop mình đang có **Nike Air Max 270** và **Air Jordan** đó. Hay bạn có mẫu nào khác đang muốn tìm hiểu không để mình xem giúp nhé!\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n4. [Adidas Ultraboost 5.0](/product/15)\n5. [Nike Air Max 270](/product/14)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 14034.359455108643, '2025-11-14 10:26:36.176702', 1),
(253, NULL, 'tôi muốn so sánh nike air max 270 với Air force 1 lơ', 'Chào bạn! Nike Air Max 270 thì Footy có hàng nha, đây là mẫu có đệm Air êm ái, rất thoải mái cho các hoạt động hàng ngày. Còn mẫu Air Force 1 lơ thì hiện tại Footy chưa có ạ. Bạn có muốn mình so sánh Air Max 270 với một mẫu giày Nike khác hoặc một đôi giày nào khác đang có sẵn không?\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 17154.274225234985, '2025-11-14 10:27:45.301413', 1),
(254, NULL, 'vậy đôi Nike Air Max 270 và Air-jordan thì đôi nào sẽ chạy bộ tốt hơn', 'Chào bạn!\nDựa trên mô tả thì **Nike Air Max 270** với đệm Air êm ái sẽ phù hợp hơn cho những buổi chạy bộ nhẹ nhàng hoặc đi lại hàng ngày đó ạ. Còn **Air-jordan** thì thường được biết đến là một mẫu giày lifestyle, thiên về thời trang và sưu tầm hơn là để chạy bộ nha.', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 5229.767322540283, '2025-11-14 10:28:56.239027', 1),
(255, NULL, 'Bạn nghĩ thương hiệu Nike với Adidas thì thương hiệu nào tốt hơn', 'Chào bạn!\n\nNike và Adidas đều là những thương hiệu cực kỳ nổi tiếng và có chất lượng tuyệt vời nha! Mỗi hãng lại có thế mạnh riêng. Ví dụ, Nike nổi bật với công nghệ Air cushioning hay ZoomX siêu êm, còn Adidas thì có Ultraboost với đệm phản hồi cực tốt.\n\nFooty thấy bạn cũng rất quan tâm đến các mẫu Nike như Air Max 270 hay Air Jordan, đây đều là những mẫu giày đình đám của Nike đó ạ.\n\nThực sự thì \'tốt hơn\' sẽ tùy vào sở thích và nhu cầu sử dụng của bạn nữa đó. Bạn đang tìm giày để làm gì ạ, Footy sẽ tư vấn chi tiết hơn nha!', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 15775.691032409668, '2025-11-14 10:29:47.728915', 1),
(256, NULL, 'Tôi cần đôi Nike nam chạy bộ.', 'À uầy, bạn tìm Nike nam chạy bộ đúng không nè? ????\n\nHiện tại bên mình có **Nike Air Max 270** nè, mẫu này siêu comfy, có đệm Air nên đi lại hàng ngày hay chạy bộ nhẹ nhàng là bao êm luôn đó. Mẫu này đang có size 36, 37, 38 với màu đen hoặc xanh nha.\n\nNếu bạn muốn tìm đôi nào chuyên về chạy bộ hơn, thì **Adidas Ultraboost 5.0** bên mình cũng siêu đỉnh luôn đó, đệm nảy bao phê, rất phù hợp cho chạy bộ đó bạn.\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 13435.733318328857, '2025-11-14 10:57:52.332788', 1),
(257, NULL, 'Giày này có chống nước không?', 'À bạn ơi, đôi này thì không có chống nước nha. ☔️\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 10614.832401275635, '2025-11-14 10:58:26.863970', 1),
(258, NULL, 'Size 40 còn hàng không?', 'Ê bạn ơi, đôi Nike Air Max 270 này size 40 thì không có sẵn rồi nha, bên mình chỉ còn tới size 38 thôi à. ????\n\nMà nếu bạn tìm giày chạy bộ nam size 40 thì Footy gợi ý **Adidas Ultraboost** nè, đôi này siêu êm chân, chạy bao sướng mà có đủ size từ 39-43 luôn đó! ✨\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 13144.370079040527, '2025-11-14 10:58:59.128052', 1),
(259, NULL, 'Tôi muốn đôi Nike, size 40, màu trắng, nhẹ, dưới 3 triệu, chạy bộ được.', 'Footy check kho rồi nè bạn ơi! ???? Hiện tại thì bên mình chưa có đôi Nike nào đủ size 40, màu trắng, vừa để chạy bộ mà giá lại dưới 3 triệu đâu nha.\n\nCó đôi Nike Air Max 270 nè, giá 2.580.000 VND, đi daily siêu êm luôn. Mà đôi này chỉ có size 36, 37, 38 với màu đen/xanh thôi bạn ạ. Với nó cũng không phải giày chuyên dụng để chạy bộ đâu nha.\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 23937.031984329224, '2025-11-14 10:59:45.178624', 1),
(260, NULL, 'So sánh giúp tôi Air Max 270 và Air Force 1.', 'Bạn ơi, Footy check kho thì bên mình đang có sẵn Nike Air Max 270 nha! Đôi này cực đỉnh với đệm Air êm ái, mang đi everyday là bao thoải mái luôn á.\n\nCòn Nike Air Force 1 thì hiện tại FootFashion chưa về hàng, nên Footy chưa thể so sánh trực tiếp giúp bạn được rồi. Nếu bạn thích vibe Nike, muốn một đôi vừa chất vừa êm thì Air Max 270 này là một lựa chọn không tồi đâu nha! ????', 'help', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 5916.717290878296, '2025-11-14 11:07:00.239198', 1),
(261, NULL, 'So sánh giúp tôi Air Max 270 và Air Force 1 Low.', 'À okela bạn! Để Footy so sánh Nike Air Max 270 với Nike Air Force 1 Low cho bạn dễ hình dung nha.\n\nVề độ êm ái thì Air Max 270 có đệm khí 270 độ siêu lớn ở gót, nên đi sẽ bồng bềnh, êm ái hơn hẳn á. Còn Air Force 1 Low cũng có Air nhưng sẽ cho cảm giác chắc chân, cứng cáp hơn chút xíu.\n\nVề phong cách, Air Max 270 khá hiện đại, năng động kiểu thể thao, còn Air Force 1 Low là huyền thoại streetwear rồi, cực kỳ basic mà dễ phối đồ luôn. Thường thì Air Max 270 sẽ dùng chất liệu vải lưới/dệt kim thoáng khí, còn Air Force 1 Low đa phần là da nên bền nhưng form sẽ cứng hơn nha.\n\nÀ mà Footy check kho thì bên mình đang có sẵn Air Max 270 nè, còn Air Force 1 Low thì hiện chưa về nha bạn ơi.', 'help', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 17934.667825698853, '2025-11-14 11:08:39.953752', 1),
(262, NULL, 'cho tôi xin link sản phẩm  Air Force 1 Low.', 'U là trời, Footy check kho thì đôi Air Force 1 Low bên mình đang hông có sẵn nha bạn ơi. ???? Nhưng mà nếu bạn vẫn mê Nike thì Footy có Nike Air Max 270 nè, đôi này cũng bao êm, đi cực chất luôn đó!\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'unknown', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0, 5898.158073425293, '2025-11-14 11:09:31.867780', 1),
(263, NULL, 'Tìm giày Nike', 'Hê lô bạn iu, Nike thì bên mình đang có mấy em này nè:\n\n1.  **Nike Air Max 270**: Em này giá *2.580.000 VND*. Đủ size từ *36-38*, có màu *Đen* và *Xanh* nha. Em nó đi cực thoải mái, êm ái cho outfit hàng ngày luônnn.\n2.  **Air-jodan**: \"Trùm cuối\" đây rồi, giá *12.300.000 VND*. Hiện có size *38, 39* với hai màu *Xanh* và *Nâu* cực chất. \"Giày ngon\" là có thật nha!\n\nBạn ưng em nào không nè? ????\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 13913.490295410156, '2025-11-14 11:26:33.410482', 1),
(264, NULL, 'Nó có màu đen không', 'Có chứ bạn! Em Air Max 270 có màu đen nha.', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 4988.607168197632, '2025-11-14 11:26:46.817438', 1),
(265, NULL, 'Giày này chống nước không', 'À không nha bạn ơi, em Nike Air Max 270 này hông có chống nước nha. Chủ yếu em nó mang êm ái, thoải mái cho mình đi lại hằng ngày thôi á.', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 3114.586114883423, '2025-11-14 11:27:04.581648', 1),
(266, NULL, 'Có size 40 không?', 'Size 40 hả bạn? Tiếc ghê, em Nike Air Max 270 này chỉ có 36, 37, 38 thôi nè. Hông có size 40 nha.', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 12283.194065093994, '2025-11-14 11:27:29.147309', 1),
(267, NULL, 'Tìm giày chạy bộ', 'Oke la, tìm giày chạy bộ đúng hông nè! Footy gợi ý liền cho bạn 2 em này nha, vừa chất mà vừa chạy ngon lành cành đào luôn:\n\n1.  **Adidas Ultraboost 5.0:** Em này đỉnh của chóp cho mấy bạn mê chạy bộ, có đệm siêu êm chân luôn. Giá mềm oặt có **100.000 VND** thôi. Có đủ size nam **37, 38** và màu **đen** hoặc xám nè.\n    [Adidas Ultraboost 5.0](link_to_Adidas_Ultraboost_5.0)\n2.  **Nike Air Max 270:** Nếu bạn team Nike thì có em này cũng cưng lắm nè, siêu thoải mái cho hoạt động hằng ngày hoặc chạy bộ nhẹ đó. Giá **2.580.000 VND**. Có size nam **36, 37, 38** và màu **đen** hoặc xanh nha.\n    [Nike Air Max 270](link_to_Nike_Air_Max_270)\n\nBạn xem thử ưng em nào không nha! ????\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 17918.519020080566, '2025-11-14 12:00:26.816271', 1),
(268, NULL, 'Có giày Balenciaga không?', 'Footy check liền nè! Hiện tại thì FootFashion tụi mình chưa có Balenciaga á bạn ơi. ????\n\nBạn có muốn Footy gợi ý đôi nào cá tính tương tự hay brand khác \"ngon lành\" không nè?\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 18661.885261535645, '2025-11-14 12:01:53.810405', 1),
(269, NULL, 'Cho tôi link Ultraboost', 'Oke liền nè bạn ơi! Link Ultraboost đây nha: https://footfashion.vn/adidas-ultraboost-5.0 ✨\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 5896.834373474121, '2025-11-14 12:02:31.934503', 1),
(270, NULL, 'cho tôi xin đôi giày Air-jodan', 'Ô là la, Air-jodan đỉnh chóp đây rồi bạn ơi! ???? Em này bên FootFashion đang có sẵn nha. Giá của em nó là 12.300.000 VND, có size 38, 39 và màu xanh, nâu đó. \"Giày ngon\" đúng nghĩa đen luôn! ✨\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 3528.573513031006, '2025-11-14 12:02:55.495970', 1),
(271, NULL, 'Link sản phẩm của nó á', 'Oke liền nè bạn ơi! Link Air-jodan xịn xò đây nha: https://footfashion.vn/air-jodan ✨\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 3084.8028659820557, '2025-11-14 12:03:08.247015', 1);
INSERT INTO `core_chatbotconversation` (`id`, `session_id`, `message`, `response`, `intent`, `response_type`, `sentiment`, `confidence_score`, `processing_time`, `created_at`, `user_id`) VALUES
(272, NULL, 'Cho tôi link Air Max 270', 'Oke liền bạn ơi! Link Air Max 270 xịn xò đây nha: https://footfashion.vn/nike-air-max-270\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 2754.2595863342285, '2025-11-14 12:06:36.919054', 1),
(273, NULL, 'Cho tôi link Nike Air Max 270 và Air Jordan', 'Oke liền nè bạn ơi! Link Air Max 270 và Air-jodan xịn xò đây nha:\n\n*   **Nike Air Max 270**: https://footfashion.vn/nike-ai...\n*   **Air-jodan**: https://footfashion.vn/air-jo...\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3413.743734359741, '2025-11-14 12:06:59.298535', 1),
(274, NULL, 'So sánh Air Max 270 và Air Force 1 Low', 'Chào bạn nè!\n\nVề Air Max 270, Footy có sẵn nha: đôi này siêu thoải mái, có đệm Air êm ái, thích hợp đi hàng ngày luôn đó. Giá em nó là 2.580.000 VND, có đủ size 36, 37, 38 và các màu đen, xanh cực dễ phối đồ luôn.\n\nCòn Air Force 1 Low thì hiện tại Footy chưa có hàng bạn ơi. Nếu bạn muốn tìm thêm một em Nike khác để so sánh hoặc tham khảo, bạn có thể nghía qua Air-jodan nha! Đôi này cũng siêu chất, giá 12.300.000 VND, có size 38, 39 và màu xanh, nâu đó.\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 11204.405546188354, '2025-11-14 12:07:29.309190', 1),
(275, NULL, 'Air Max 270 size 40 còn hàng không?', 'U là trời, tiếc quá bạn ơi! Với Nike Air Max 270 thì Footy chỉ còn các size 36, 37, 38 thôi nè, chưa có size 40 nha bạn. ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6553.944826126099, '2025-11-14 12:08:04.909283', 1),
(276, NULL, 'Có giày Balenciaga không?', 'Footy check liền nè! Hiện tại thì FootFashion tụi mình chưa có Balenciaga á bạn ơi. ????\n\nBạn có muốn Footy gợi ý đôi nào cá tính tương tự hay brand khác \"ngon lành\" không nè?\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n3. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 26.770353317260742, '2025-11-14 12:08:33.662107', 1),
(277, NULL, 'Tìm giày Nike', 'Hello bạn iu, Footy đây! ✨\nGiày Nike bên mình có 2 em cực hot nè:\n\n1.  **Nike Air Max 270**: Giá 2.580.000 VND. Em này siêu êm ái, mang đi everyday là chuẩn bài luôn. Có size 36, 37, 38, màu đen và xanh dương nha.\n2.  **Air-jodan**: Giá 12.300.000 VND. Em này thì khỏi nói rồi, \"giày ngon\" đúng điệu luôn. Hiện có size 38, 39, màu xanh dương và nâu.\n\nBạn ưng em nào thì hú Footy nhen! ????\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 14350.89921951294, '2025-11-14 12:46:08.791408', 1),
(278, NULL, 'Nó có màu đen không', 'Uầy, có liền luôn bạn ơi! Em Nike Air Max 270 có màu đen cực ngầu đó nha. ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 6977.792501449585, '2025-11-14 12:46:24.653669', 1),
(279, NULL, 'Giày này chống nước không', 'Footy đây bạn ơi! Em Nike Air Max 270 này thiên về sự thoải mái và đệm khí tốt cho everyday wear, chứ không có tính năng chống nước nha bạn. Nếu lỡ dính mưa nhẹ thì ok chứ mưa lớn là không ổn đâu nè.', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 2962.360620498657, '2025-11-14 12:46:34.524435', 1),
(280, NULL, 'Có size 40 không?', 'À Footy nè! Tiếc ghê, em Nike Air Max 270 hiện chưa về size 40 bạn ơi. ????\n\nNhưng mà không sao, bên FootFashion vẫn có vài lựa chọn siêu đỉnh khác có size 40 luôn nha, như Vans Slip-On Checkerboard hoặc Vans Sk8-Hi Black White đó. Bạn có muốn Footy kể thêm không?', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 6508.776664733887, '2025-11-14 12:46:49.950857', 1),
(281, NULL, 'Gợi ý 2 đôi chạy bộ', 'Footy đây bạn ơi! Muốn tìm 2 đôi chạy bộ phải không nè? Footy gợi ý liền cho bạn nha.\n\nĐầu tiên là em **Adidas Ultraboost 5.0** nè, đỉnh của chóp cho chạy bộ luôn, đệm siêu êm á. Giá siêu bất ngờ chỉ 100K thôi đó bạn (size 37, 38, có màu đen, xám).\n\nVới lại có em **Nike Air Max 270** nữa nha. Em này thì bao thoải mái, đệm khí cực êm cho đi lại hằng ngày hoặc chạy nhẹ cũng okela la luôn. Giá 2.580.000 VNĐ (size 36, 37, 38, màu đen, xanh). Đặc biệt là em nó đến từ Nike, đúng gu bạn thích luôn nè! ????\n\nCả hai em này đều có màu đen nữa đó, siêu dễ mix đồ luôn!\n\n???? Link sản phẩm:\n1. [Converse Chuck Taylor High](/product/18)\n2. [Vans Old Skool](/product/17)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 21662.59241104126, '2025-11-14 12:47:37.139816', 1),
(282, NULL, 'Tôi muốn đôi Nike, size 38, đi chạy bộ, nhẹ, màu trắng, giá dưới 3 triệu, còn hàng không?', 'Footy đây bạn ơi! Bạn tìm đôi Nike xịn xò ghê! Nhưng mà tiếc ghê, hiện tại Footy chưa có đôi Nike nào size 38, màu trắng, đi chạy bộ nhẹ mà giá dưới 3 triệu đâu bạn ơi. ????\n\nGần nhất thì Footy có em **Nike Air Max 270** nè, giá 2.580.000 VNĐ, size 38 đủ luôn. Em này đi êm ru, đi bộ hay chạy nhẹ đều ổn áp hết, nhưng có màu đen hoặc xanh thôi bạn nha. ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 27228.777408599854, '2025-11-14 12:48:29.769541', 1),
(283, NULL, 'cho tôi xin link đôi giày này', 'Footy đây bạn ơi! Footy hiểu bạn muốn link đôi Nike bữa mình hỏi hen. Tiếc ghê là đôi Nike màu trắng, size 38, chuyên chạy bộ dưới 3 củ hiện Footy chưa có đó bạn. ????\n\nNhưng mà Footy có đôi Nike Air Max 270 này nè, cũng size 38, giá 2.580.000 VNĐ, đi siêu êm ái luôn. Chỉ là em nó có màu Đen hoặc Xanh thôi à. Bạn tham khảo thử nha:\n\n[Link Nike Air Max 270]\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 20167.323350906372, '2025-11-14 12:49:13.247751', 1),
(284, NULL, 'Có khuyến mãi nào không?', 'Footy đây bạn ơi! Đúng là Footy có mấy deal xịn sò đang chờ bạn săn đây nè:\n\n*   **Mã Giam50**: Giảm ngay 50% luôn nha, áp dụng đến 12/12/2025. Nhanh tay chốt đơn!\n*   **Mã FreeShip**: Giảm 20% cho phí ship, siêu hời đó. Hạn dùng đến 30/12/2025.\n*   **Mã Giam10k**: Giảm 10% tổng hóa đơn, đến 29/11/2025 là hết hạn đó.\n\nBạn xem có mã nào ưng bụng thì hú Footy nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.6, 13860.990047454834, '2025-11-14 12:49:58.171223', 1),
(285, NULL, 'chính sách đổi trả bên bạn như thế nào?', 'Footy đây bạn ơi! Về chính sách đổi trả thì bên FootFashion mình có hỗ trợ đổi hàng trong vòng 7 ngày kể từ khi bạn nhận được sản phẩm nha. Quan trọng là giày còn nguyên vẹn, chưa qua sử dụng và còn đủ tem mác nha.\n\nNếu cần biết chi tiết hơn thì bạn cứ hỏi Footy hen! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2364.6767139434814, '2025-11-14 12:50:17.904123', 1),
(286, NULL, 'So sánh Air Max 270 và Air Force 1 Low', 'À bạn ơi, Footy check rồi nè!\n\nVề Air Max 270 thì bên mình có sẵn nha. Em này đúng chuẩn giày siêu comfy, có đệm Air xịn sò, mang đi đâu cũng êm ru. Giá là 2.580.000 VND, có size từ 36-38 và đủ màu đen với xanh luôn đó bạn.\n\nTiếc là Air Force 1 Low thì Footy chưa có hàng ở đây mất rồi ????. Bạn có muốn tham khảo thêm mẫu Nike nào khác không, hay mình cứ tìm thử mấy đôi vibe tương tự xem sao ha?', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 57113.6679649353, '2025-11-14 12:51:54.433771', 1),
(287, NULL, 'trong cửa hàng bạn có bao nhiêu đôi giày thương hiệu vans', 'Chào bạn! Footy check nhanh rồi nè!\n\nBên mình đang có **4 đôi giày** đến từ nhà Vans siêu hot đó nha. Vừa nhiều mẫu lại vừa đa dạng style luôn. ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6098.443269729614, '2025-11-14 12:52:26.172376', 1),
(288, NULL, 'bạn thấy thương hiệu vans và nike thì thì thương hiệu nào tốt hơn', 'Ố là la, câu hỏi này khó nha bạn ơi! ???? Kiểu như hỏi \"trà sữa hay cà phê ngon hơn\" vậy á. Mỗi hãng có một thế mạnh riêng siêu đỉnh luôn nè:\n\n*   **Vans** thì siêu cool với vibe skater, cực bền, phong cách basic nhưng chất lừ, dễ phối đồ mà lại có mấy họa tiết iconic không lẫn vào đâu được. Cứ nhắc đến Vans là nghĩ ngay đến sự thoải mái, phóng khoáng, cực hợp để đi học, đi chơi nhẹ nhàng.\n*   Còn **Nike** thì thiên về hiệu suất, công nghệ xịn sò, đa dạng mẫu mã từ giày chạy bộ đỉnh cao đến mấy đôi lifestyle thời thượng. Nike luôn tiên phong trong đổi mới, giúp bạn vừa stylish lại vừa tối ưu được trải nghiệm khi mang giày.\n\nNói chung, **chọn Vans hay Nike thì tùy vào sở thích, phong cách và nhu cầu của bạn thôi!** Thích basic, bền bỉ, đậm chất đường phố thì Vans. Thích công nghệ, đa dạng lựa chọn, thiên về thể thao/thời trang thì Nike nha. Cả hai đều là \"huyền thoại\" hết đó! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 11685.73522567749, '2025-11-14 12:53:07.580523', 1),
(289, NULL, 'So sánh Nike Air Max 270 và Air Jordan', 'Ố là la, so sánh hai \'đứa con cưng\' nhà Nike luôn hả bạn ơi! Mỗi em một vibe, một giá khác nhau đó nha.\n\n**Nike Air Max 270** thì thiên về sự thoải mái, êm ái khỏi bàn nhờ công nghệ Air, hợp để đi daily, quẩy cả ngày không lo mỏi chân. Em này giá cũng \'dễ thở\' hơn nhiều, chỉ khoảng 2 triệu 580 ngàn thôi. Có đủ size từ 36-38 và hai màu basic là đen với xanh.\n\nCòn **Air Jordan** á, em này là \'đẳng cấp\' khác liền nha bạn! Giá cao vút luôn, hơn 12 triệu 300 ngàn lận. Thường là hàng hiếm, chất lừ, dành cho mấy bạn mê sneaker hoặc muốn thể hiện cá tính mạnh mẽ đó. Size em này có 38, 39, với các màu xanh, nâu.\n\nTóm lại, nếu bạn ưu tiên sự thoải mái, giá tốt để đi hàng ngày thì Air Max 270 là chân ái. Còn muốn đầu tư một đôi siêu phẩm, thể hiện \'chất\' riêng thì Air Jordan là lựa chọn không tồi chút nào đâu! ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 19971.598863601685, '2025-11-14 13:00:39.635768', 1),
(290, NULL, 'Tìm giày Nike', 'Hello bạn iu! Bạn tìm giày Nike đúng không nè? Store mình đang có mấy em Nike siêu hot này nha:\n\n*   **Nike Air Max 270:** Giá 2.580.000 VND. Đôi này mang siêu thoải mái, êm ái cho daily wear luôn. Có đủ size 36, 37, 38 và hai màu Đen, Xanh đó. [Xem chi tiết Nike Air Max 270]\n*   **Air-jodan:** Em này thì đỉnh chóp rồi, giá 12.300.000 VND. Size có sẵn 38, 39 với các màu Xanh, Nâu. Hàng hiếm đó nha! [Xem chi tiết Air-jodan]\n\nBạn thích em nào thì hú mình nha! ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 7235.706806182861, '2025-11-14 16:39:28.257841', 1),
(291, NULL, 'Tìm giày nike nam size 40 màu đen dưới 2 triệu', 'Hello bạn iu, Footy check rồi mà tìm Nike nam size 40 màu đen dưới 2 triệu đang hơi khoai đó ????\n\nHiện tại, store mình có em Nike Air Max 270 màu đen cực chất cho nam nè. Nhưng mà em này giá **2.580.000 VND** lận và size lớn nhất là **38** thôi à. Tiếc ghê chưa có size 40 nha bạn ơi.\n\nBạn xem thử em này nha: [Link Nike Air Max 270]', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 59554.14032936096, '2025-11-14 16:40:59.062062', 1),
(292, NULL, 'giày này có chống nước được không', 'Ủa bạn iu đang hỏi đôi Nike nào vậy ta? Footy vẫn đang tìm đôi Nike nam size 40 màu đen dưới 2 củ cho bạn nè, chưa ra luôn ý. Mà nói chung mấy đôi Nike sneaker kiểu như Air Max 270 ở bên FootFashion tụi mình thì thường là không chống nước đâu nha bạn.', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.7, 23507.736206054688, '2025-11-14 16:41:51.636051', 1),
(293, NULL, 'So sánh Nike Air Max 270 và Air jordan', 'Oke la, Footy so sánh cho bạn 2 em Nike này nha!\n\n*   **Nike Air Max 270:**\n    *   Giá mềm hơn hẳn nè, chỉ **2.580.000 VND**.\n    *   Size: **36, 37, 38**.\n    *   Màu sắc: Có **đen** với xanh dương.\n    *   Mô tả: Đôi này là sneaker siêu thoải mái, có đệm Air xịn sò, đi hàng ngày là bao êm luôn.\n*   **Air-jodan:**\n    *   Giá chót vót hơn nhiều nè bạn, tận **12.300.000 VND**. (Giá này là dòng sưu tầm hay gì đó nha bạn iu)\n    *   Size: **38, 39**.\n    *   Màu sắc: Xanh dương với nâu.\n    *   Mô tả: À em này thì \"giày ngon\" theo miêu tả đó, thường là dòng huyền thoại với có giá trị sưu tầm cao đó bạn.\n\nTóm lại, nếu bạn thích sự thoải mái, giá phải chăng hơn và có màu đen thì Air Max 270 là lựa chọn ổn áp đó. Còn Air-jodan thì \"đỉnh chóp\" hơn về giá trị và độ hiếm á! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 10118.64972114563, '2025-11-14 16:42:45.329982', 1),
(294, NULL, 'có khuyến mãi nào không', 'Ơi có liền nhen bạn! Hiện FootFashion đang có mấy mã cực xịn nè:\n\n*   **Giam50**: Giảm 50% lận đó, áp dụng đến 12/12/2025.\n*   **FreeShip**: Giảm 20% nè, tận 30/12/2025 luôn.\n*   **Giam10k**: Giảm 10% nha, mã này hết hạn sớm hơn chút, 29/11/2025 là hết rùi á.\n\nBạn tranh thủ shopping nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 2890.825033187866, '2025-11-14 16:43:16.917575', 1),
(295, NULL, 'Chính sách đổi trả bên bạn như thế nào', 'À rẹt rẹt! Về chính sách đổi trả bên FootFashion thì tụi mình luôn ưu tiên trải nghiệm của khách nha bạn.\n\nNếu giày có lỗi từ nhà sản xuất hoặc bạn đổi ý trong vòng [số ngày cụ thể, ví dụ: 7 ngày] kể từ khi nhận hàng mà sản phẩm còn nguyên tag, chưa qua sử dụng thì cứ inbox tụi mình hỗ trợ đổi/trả liền nha.\n\nBạn có thắc mắc gì thêm không nè?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3279.6192169189453, '2025-11-14 16:43:39.820233', 1),
(296, NULL, 'So sánh thương hiệu vans với puma xem bên thương hiệu nào tốt hơn', 'Ố là la, Vans với Puma à? Hai brand này có vibe riêng hẳn luôn đó bạn ơi! ✨\n\nNói về **Vans** nè, thì em này siêu iconic trong giới trượt ván với phong cách đường phố, casual. Giày Vans thường có đế bánh waffle đặc trưng, cảm giác đi ôm chân, bền bỉ, dễ phối đồ lắm luôn. Giá thì cũng hạt dẻ hơn một xíu so với nhiều brand khác, dễ tiếp cận ý. Kiểu basic, cool ngầu mà không cần quá cầu kỳ.\n\nCòn về **Puma**, em này thì mạnh về mảng thể thao, lifestyle pha chút retro cực chất. Puma hay có những đôi form thon gọn hơn, chú trọng công nghệ đệm, độ êm ái khi di chuyển. Puma cũng hay collab với nhiều nghệ sĩ, nhà thiết kế nên các BST thường rất độc đáo và thời trang. Giá thì có thể nhỉnh hơn một tí tùy dòng nha.\n\nNói chung, \"tốt hơn\" thì khó nói lắm bạn ơi, nó tùy vào **phong cách** và **mục đích sử dụng** của bạn á.\n*   Bạn thích sự năng động, basic, thoải mái kiểu skater/streetwear thì Vans đỉnh.\n*   Bạn mê sự cá tính, hơi hướng thể thao pha chút thời trang, hoặc retro thì Puma lại là chân ái.\n\nBạn đang tìm giày cho mục đích gì thì Footy tư vấn kĩ hơn nha! ????\n\n???? Link sản phẩm:\n1. [Puma Suede Classic](/product/16)\n', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6154.953479766846, '2025-11-14 16:44:11.699991', 1),
(297, NULL, 'Okeee giờ cho tôi xem link đôi Air jordan', 'Oke bạn chờ Footy xíu nha, link \"Air-jodan\" đang tới nè: [footfashion.vn/san-pham/air-jodan](https://footfashion.vn/san-pham/air-jodan) ✨\n\n???? Link sản phẩm:\n1. [Puma Suede Classic](/product/16)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6096.410751342773, '2025-11-14 16:44:52.649009', 1),
(298, NULL, 'Okeee giờ cho tôi xem link sản phẩm Air jordan', 'Ê bạn ơi, Footy gửi lại link Air-jodan cho bạn nè, sợ bạn bị trôi tin nhắn đó mà: [footfashion.vn/san-pha...\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 7167.502880096436, '2025-11-14 16:46:08.872062', 1),
(299, NULL, 'Chính sách đổi trả bên bạn như thế nào', 'Chào bạn, Footy đây! Về chính sách đổi trả bên mình thì siêu dễ nha:\n\n*   **Thời gian đổi trả:** Bạn có 7 ngày kể từ khi nhận hàng để đổi trả sản phẩm.\n*   **Điều kiện:** Giày phải còn nguyên tem mác, chưa qua sử dụng và còn đầy đủ hộp (nếu có).\n*   **Lý do:** Bạn có thể đổi size, đổi mẫu khác hoặc trả lại nếu sản phẩm có lỗi từ nhà sản xuất.\n*   **Liên hệ:** Khi cần đổi trả, bạn cứ inbox tụi mình liền nha, Footy sẽ hướng dẫn chi tiết ạ!\n\nYên tâm mua sắm nha bạn ơi! ????', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3632.478952407837, '2025-11-15 06:21:10.825359', 1),
(300, NULL, 'hello', 'Heyyy bạn iu! Footy đây, có gì hot không nè? ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 4468.313694000244, '2025-11-15 06:41:37.972890', 1),
(301, NULL, 'hello', 'Hiii! Footy đâyyy, có gì hot không bạn ơi? ✨', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.95, 3664.874315261841, '2025-11-15 06:52:02.762781', 1),
(302, NULL, 'tim giay nike', 'Ố là la, Nike luôn là chân ái của nhiều người nè! Footy có mấy em Nike cực phẩm đang chờ bạn rước về đây:\n\n1.  **Nike Air Max 270**: Em này đang có giá 2.580.000 VND, có size 36-38, màu Đen với Xanh dương, cực kì thoải mái luôn.\n    [Link sản phẩm: Nike Air Max 270]\n2.  **Air-jodan**: \"giày ngon\" đúng nghĩa đen nhaaa, giá 12.300.000 VND, có size 38-39, màu Xanh với Nâu. Đôi này siêu chất!\n    [Link sản phẩm: Air-jodan]\n\nBạn ưng em nào thì hú Footy liền nha! ????\n\n???? Link sản phẩm:\n1. [Nike Air Max 270](/product/14)\n2. [Air-jodan](/product/26)\n3. [Nike Air Force 1 Low](/product/27)\n', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 1, 3560.727834701538, '2025-11-15 06:52:22.238707', 1),
(303, NULL, 'giày nike', 'U là trời, Nike thì phải xem ngay mấy em này rùi bạn iu ơi:\n\n*   **Nike Air Max 270** nè (giá 2.580.000 VND, size 36-38, có màu Đen với Xanh biển) [Link sản phẩm]\n*   Với cả **Air-jodan** (giá hơi chát xíu 12.300.000 VND nha, size 38-39, màu Xanh với Nâu) [Link sản phẩm]\n\nBạn chấm em nào hú Footy liền nha! ????', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 6742.345571517944, '2025-11-15 08:47:57.196473', 1),
(304, NULL, 'hello', 'Hi bạn iu! Footy nghe rõ nè. ✨ Bạn đang tìm gì hay muốn Footy giúp bạn điều gì nè?', 'greeting', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 2182.823657989502, '2025-11-15 09:09:07.422274', 1),
(305, NULL, 'tìm giày nike', 'Yesss, tìm giày Nike thì Footy có ngay 2 em siêu phẩm này nha bạn iu ơi! Check liền nè:\n\n*   **Nike Air Max 270** đỉnh của chóp cho các bạn nam nè. Giá em nó là 2.580.000 VND, có đủ size từ 36 đến 38. Màu thì có Đen với Xanh, tha hồ chọn nha.\n*   **Air-jodan** huyền thoại dành cho các bạn nam mê hàng hiếm. Em này có giá 12.300.000 VND, size từ 38 đến 39, với hai màu Xanh và Nâu siêu chất.', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.9, 3411.168098449707, '2025-11-15 09:09:29.112100', 1),
(306, NULL, 'Nó có màu đen không', 'Yesss, có luôn nha bạn iu ơi! Em Nike Air Max 270 có màu đen cực chất luôn đó. ✨', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 5394.717454910278, '2025-11-15 09:09:56.825119', 1),
(307, NULL, 'Có size 40 ko', 'Bạn ơi, em Nike Air Max 270 này chỉ có đến size 38 thôi nè. ????\n\nNhưng đừng lo nha, nếu bạn tìm size 40 thì Footy có vài lựa chọn siêu đỉnh khác nè:\n- **Vans Sk8-Hi Black White**: Form high-top cực chất, có size 39, 40 luôn đó.\n- **Converse All Star Lift Platform**: Đế độn tăng chiều cao nhẹ nhàng, có size 39, 40 luôn nha.\n\nBạn muốn Footy tư vấn thêm về đôi nào không?', 'product_search', 'message', '{\"sentiment\": \"neutral\", \"confidence\": 0.0, \"is_urgent\": false, \"positive_words\": 0, \"negative_words\": 0, \"sentiment_score\": 0}', 0.8, 9905.147314071655, '2025-11-15 09:10:26.205527', 1);

-- --------------------------------------------------------

--
-- Table structure for table `core_chatbotfeedback`
--

CREATE TABLE `core_chatbotfeedback` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `message` longtext NOT NULL,
  `response` longtext NOT NULL,
  `intent` varchar(50) NOT NULL,
  `feedback_type` varchar(20) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_chatbotfeedback`
--

INSERT INTO `core_chatbotfeedback` (`id`, `created_at`, `session_id`, `message`, `response`, `intent`, `feedback_type`, `user_id`) VALUES
(1, '2025-11-07 14:02:25.809060', '73edddfa-7426-40db-a1dc-0465839fbb55', 'Xem giày Nike nam', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????\n\n???? Bạn có muốn xem các sản phẩm phù hợp không? (Trả lời \'có\' hoặc \'xem sản phẩm\' nha!)', 'product_search', 'positive', NULL),
(2, '2025-11-07 14:02:55.379094', '73edddfa-7426-40db-a1dc-0465839fbb55', 'Có hình ảnh về Nike không', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????', 'product_search', 'negative', NULL),
(3, '2025-11-07 14:03:21.309551', '73edddfa-7426-40db-a1dc-0465839fbb55', 'Xem giày Nike', 'Ok nè! ???? Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? ????', 'product_search', 'negative', NULL),
(4, '2025-11-07 14:24:02.603442', '48cfbe19-2f4e-4f5e-b999-5a230b5c7f9a', 'xin chào bạn', 'Ui em chưa hiểu rõ ý bạn lắm ???? Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! ????', 'unknown', 'negative', NULL),
(5, '2025-11-07 15:25:08.833892', 'dba826c9-373f-4a87-99c6-cc5092b46d75', 'bạn có thể cho tôi xem hình ảnh 2 đôi giày ấy không', 'Được luôn nè bạn ơi! Ảnh mấy em ấy ở ngay dưới đây nha ????', 'product_search', 'negative', NULL),
(6, '2025-11-07 15:46:43.071474', '1b7ad1da-ea6c-4192-9270-9db376f8633a', 'oke cho tôi xin đường link sản phẩm ', 'Dạ đây ạ! ✨ Bạn click vào link bên dưới để xem chi tiết về hai em Nike Air Max 270 và Air-jordan xịn xò nha! ????', 'unknown', 'negative', NULL),
(7, '2025-11-07 15:55:55.571672', '5e9c5ae5-74f1-4fb4-83ef-ec06309a8e3e', 'bạn có thể gợi ý cho tôi đôi giày thương hiệu nike không', 'Chào bạn! Footy có ngay vài em Nike cực chất cho bạn đây nè! ✨\n\n*   **Nike Air Max 270:** Đôi này siêu thoải mái với đệm Air êm ái, hợp mang đi học, đi chơi mỗi ngày luôn á. Giá chỉ 10,000 VND thôi.\n*   **Air-jodan:** Nếu bạn tìm một item đẳng cấp hơn thì Air-jodan là lựa chọn không thể bỏ qua, thiết kế siêu ngầu và chất lượng khỏi bàn. Giá 12,300,000 VND nha.\n\nBạn muốn tìm hiểu thêm về đôi nào không? ????', 'greeting', 'positive', NULL),
(8, '2025-11-07 15:56:36.868142', '5e9c5ae5-74f1-4fb4-83ef-ec06309a8e3e', 'oke vậy bạn có link sản phẩm đó không', 'Oke la bạn ơi! Link của mấy em Nike Air Max 270 và Air-jordan xịn sò Footy vừa gợi ý đây nha. Bạn cứ click vào để xem hình ảnh và thông tin chi tiết nha! ????\n\n???? Link sản phẩm:\n1. Nike Air Max 270: http://localhost:3000/product/14\n2. Air-jodan: http://localhost:3000/product/26\n', 'unknown', 'positive', NULL),
(9, '2025-11-08 08:07:02.074025', 'bfe265bf-5c83-4db0-b4d6-b4e30d5c8936', 'Cho hỏi chính sách đổi trả ', 'Em vẫn chưa rõ lắm ???? Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: \'Nike nam\' hoặc \'Adidas nữ\'', 'greeting', 'negative', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `core_chatbotmetrics`
--

CREATE TABLE `core_chatbotmetrics` (
  `id` bigint(20) NOT NULL,
  `date` date NOT NULL,
  `total_interactions` int(11) NOT NULL,
  `unique_users` int(11) NOT NULL,
  `unique_sessions` int(11) NOT NULL,
  `product_searches` int(11) NOT NULL,
  `product_clicks` int(11) NOT NULL,
  `product_purchases` int(11) NOT NULL,
  `promotion_views` int(11) NOT NULL,
  `order_queries` int(11) NOT NULL,
  `positive_feedback` int(11) NOT NULL,
  `negative_feedback` int(11) NOT NULL,
  `avg_confidence_score` double NOT NULL,
  `avg_processing_time` double NOT NULL,
  `conversion_rate` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_chatbotmetrics`
--

INSERT INTO `core_chatbotmetrics` (`id`, `date`, `total_interactions`, `unique_users`, `unique_sessions`, `product_searches`, `product_clicks`, `product_purchases`, `promotion_views`, `order_queries`, `positive_feedback`, `negative_feedback`, `avg_confidence_score`, `avg_processing_time`, `conversion_rate`, `created_at`, `updated_at`) VALUES
(1, '2025-11-13', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0.95, 2235.8102798461914, 0, '2025-11-13 14:04:53.327388', '2025-11-13 14:52:27.816400'),
(2, '2025-11-14', 81, 1, 0, 58, 0, 0, 1, 0, 0, 0, 0.8351851851851847, 9422.410285031354, 0, '2025-11-14 08:52:30.295937', '2025-11-14 16:46:08.872062'),
(3, '2025-11-15', 9, 1, 0, 5, 0, 0, 0, 0, 0, 0, 0.9000000000000001, 4773.621877034505, 0, '2025-11-15 06:21:10.851780', '2025-11-15 09:10:26.216388');

-- --------------------------------------------------------

--
-- Table structure for table `core_color`
--

CREATE TABLE `core_color` (
  `id` bigint(20) NOT NULL,
  `value` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_color`
--

INSERT INTO `core_color` (`id`, `value`) VALUES
(1, 'Black'),
(4, 'Blue'),
(10, 'Brown'),
(11, 'Gray'),
(5, 'Green'),
(7, 'Orange'),
(8, 'Pink'),
(9, 'Purple'),
(3, 'Red'),
(2, 'White'),
(6, 'Yellow');

-- --------------------------------------------------------

--
-- Table structure for table `core_conversationtag`
--

CREATE TABLE `core_conversationtag` (
  `id` bigint(20) NOT NULL,
  `tag_name` varchar(50) NOT NULL,
  `note` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `conversation_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_gender`
--

CREATE TABLE `core_gender` (
  `id` bigint(20) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_gender`
--

INSERT INTO `core_gender` (`id`, `name`) VALUES
(3, 'Nam'),
(4, 'Nữ'),
(6, 'Unisex');

-- --------------------------------------------------------

--
-- Table structure for table `core_image`
--

CREATE TABLE `core_image` (
  `id` bigint(20) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_image`
--

INSERT INTO `core_image` (`id`, `image`, `product_id`) VALUES
(19, 'product_images/NikeAirMax270.png', 14),
(20, 'product_images/NikeAirMax271.png', 14),
(21, 'product_images/NikeAirMax272.png', 14),
(22, 'product_images/AdidasUltraboots5.png', 15),
(23, 'product_images/AdidasUltraboots6.png', 15),
(28, 'product_images/PumaSuedeClassic3.png', 16),
(29, 'product_images/PumaSuedeClassic.png', 16),
(30, 'product_images/PumaSuedeClassic1.png', 16),
(31, 'product_images/PumaSuedeClassic2.png', 16),
(32, 'product_images/VansOldSkool_ONjCHiR.png', 17),
(33, 'product_images/VansOldSkool1_4N30vII.png', 17),
(34, 'product_images/ConverseChuckTaylorHigh.png', 18),
(39, 'product_images/ConverseChuckTaylorHigh1_SD7K4yL.png', 18),
(41, 'product_images/Air-Jordan.png', 26),
(42, 'product_images/Air-Jordan-PNG-File.png', 26),
(43, 'product_images/air-force-1-07-sneakers-men.jpg', 27),
(44, 'product_images/WAF1SAGELOW.png', 27),
(45, 'product_images/images.jpg', 28),
(46, 'product_images/CV-Run-Trang-Co-Cao.jpg', 28),
(47, 'product_images/ConverseAllStart19702.jpg', 29),
(48, 'product_images/ConverseAllStart1970.jpg', 29),
(49, 'product_images/ChuckTayLorAllStarLifPlatform.jpg', 30),
(50, 'product_images/ChuckTayLorAllStarLifPlatform1.jpg', 30),
(51, 'product_images/VanVault.jpg', 31),
(52, 'product_images/VanSlipOn.jpg', 32),
(53, 'product_images/VanSlipOn1.jpg', 32),
(54, 'product_images/VansAuthen.jpg', 33);

-- --------------------------------------------------------

--
-- Table structure for table `core_intenttraining`
--

CREATE TABLE `core_intenttraining` (
  `id` bigint(20) NOT NULL,
  `intent_name` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `keywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`keywords`)),
  `phrases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`phrases`)),
  `response_template` longtext NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_notification`
--

CREATE TABLE `core_notification` (
  `id` bigint(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `related_order_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `action_button_text` varchar(50) DEFAULT NULL,
  `action_url` varchar(200) DEFAULT NULL,
  `product_image` varchar(500) DEFAULT NULL,
  `related_product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_notification`
--

INSERT INTO `core_notification` (`id`, `type`, `title`, `message`, `is_read`, `created_at`, `related_order_id`, `user_id`, `action_button_text`, `action_url`, `product_image`, `related_product_id`) VALUES
(1, 'system', 'Chào mừng đến với FootFashion!', 'Cảm ơn bạn đã đăng ký tài khoản. Chúc bạn mua sắm vui vẻ!', 1, '2025-10-10 13:04:11.497928', NULL, 1, NULL, NULL, NULL, NULL),
(12, 'order_delivered', 'Đơn hàng đã hoàn tất', 'Đơn hàng 24 đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 10-10-2025 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!', 1, '2025-10-10 14:32:36.322289', 24, 1, 'Đánh Giá Sản Phẩm', '/order/24', 'http://127.0.0.1:8000/media/product_images/VansOldSkool_ONjCHiR.png', 17),
(13, 'order_delivered', 'Đơn hàng đã hoàn tất', 'Đơn hàng 24 đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 10-10-2025 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!', 1, '2025-10-10 14:32:54.013522', 24, 1, 'Đánh Giá Sản Phẩm', '/order/24', 'http://127.0.0.1:8000/media/product_images/VansOldSkool_ONjCHiR.png', 17),
(14, 'order_delivered', 'Đơn hàng đã hoàn tất', 'Đơn hàng 24 đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 10-10-2025 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!', 1, '2025-10-10 14:33:13.357768', 24, 1, 'Đánh Giá Sản Phẩm', '/order/24', 'http://127.0.0.1:8000/media/product_images/VansOldSkool_ONjCHiR.png', 17),
(15, 'order_delivered', 'Đơn hàng đã hoàn tất', 'Đơn hàng 24 đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 10-10-2025 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!', 1, '2025-10-10 14:33:29.426770', 24, 1, 'Đánh Giá Sản Phẩm', '/order/24', 'http://127.0.0.1:8000/media/product_images/VansOldSkool_ONjCHiR.png', 17),
(56, 'promotion', 'Khuyến mãi mới: 20THANG10', 'Chương trình khuyến mãi \'20THANG10\' đã được áp dụng với mức giảm giá 100.00%. Hãy nhanh tay mua sắm!', 1, '2025-10-11 05:25:29.472608', NULL, 1, 'Xem Khuyến Mãi', '/promotions', NULL, NULL),
(57, 'promotion', 'Khuyến mãi mới: 20THANG10', 'Chương trình khuyến mãi \'20THANG10\' đã được áp dụng với mức giảm giá 100.00%. Hãy nhanh tay mua sắm!', 1, '2025-10-11 05:25:29.474607', NULL, 3, 'Xem Khuyến Mãi', '/promotions', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `core_order`
--

CREATE TABLE `core_order` (
  `id` bigint(20) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `promotion_code` varchar(20) DEFAULT NULL,
  `shipping_fee` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `shipping_address_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_order`
--

INSERT INTO `core_order` (`id`, `total`, `status`, `payment_method`, `created_at`, `updated_at`, `user_id`, `payment_status`, `discount_amount`, `promotion_code`, `shipping_fee`, `subtotal`, `shipping_address_id`) VALUES
(24, 65000.00, 'delivered', 'qr', '2025-09-19 08:11:41.417763', '2025-10-10 10:04:45.197171', 1, 'paid', 0.00, NULL, 0.00, 0.00, 3),
(25, 150000.00, 'delivered', 'cod', '2025-09-19 08:13:02.142501', '2025-09-19 08:14:16.387850', 1, 'paid', 0.00, NULL, 0.00, 0.00, NULL),
(26, 65000.00, 'delivered', 'cod', '2025-09-19 10:42:03.597903', '2025-09-19 10:42:44.408279', 1, 'paid', 0.00, NULL, 0.00, 0.00, NULL),
(27, 150000.00, 'delivered', 'qr', '2025-09-19 12:30:52.912138', '2025-09-19 12:32:02.627882', 1, 'paid', 0.00, NULL, 0.00, 0.00, NULL),
(29, 65000.00, 'delivered', 'cod', '2025-09-23 09:15:11.817545', '2025-09-23 09:16:10.345867', 1, 'paid', 0.00, NULL, 0.00, 0.00, NULL),
(30, 265000.00, 'delivered', 'cod', '2025-09-23 09:18:06.628961', '2025-09-23 10:00:57.708897', 1, 'paid', 0.00, NULL, 0.00, 0.00, NULL),
(31, 80000.00, 'delivered', 'cod', '2025-09-29 08:45:02.537672', '2025-09-29 08:45:53.465040', 1, 'paid', 0.00, NULL, 0.00, 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `core_orderdetail`
--

CREATE TABLE `core_orderdetail` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `color` varchar(30) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_orderdetail`
--

INSERT INTO `core_orderdetail` (`id`, `quantity`, `unit_price`, `order_id`, `product_id`, `color`, `size`) VALUES
(22, 1, 65000.00, 24, 17, 'Black', '37'),
(23, 1, 150000.00, 25, 14, 'Black', '38'),
(24, 1, 65000.00, 26, 17, 'Black', '36'),
(25, 1, 150000.00, 27, 14, 'Black', '37'),
(27, 1, 65000.00, 29, 17, 'Black', '36'),
(28, 1, 200000.00, 30, 15, 'Black', '39'),
(29, 1, 65000.00, 30, 17, 'Black', '36'),
(30, 1, 80000.00, 31, 16, 'Black', '37');

-- --------------------------------------------------------

--
-- Table structure for table `core_payment`
--

CREATE TABLE `core_payment` (
  `id` bigint(20) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `payment_date` datetime(6) NOT NULL,
  `gateway_response` longtext NOT NULL,
  `order_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_payment`
--

INSERT INTO `core_payment` (`id`, `transaction_id`, `status`, `payment_date`, `gateway_response`, `order_id`) VALUES
(5, 'QR_24', 'paid', '2025-09-19 08:11:41.533039', 'VietQR webhook (simulated): user confirmed', 24),
(6, 'QR_27', 'paid', '2025-09-19 12:30:52.993154', 'VietQR webhook (simulated): user confirmed', 27);

-- --------------------------------------------------------

--
-- Table structure for table `core_product`
--

CREATE TABLE `core_product` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL,
  `brand_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `sales_count` int(11) NOT NULL,
  `gender_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_product`
--

INSERT INTO `core_product` (`id`, `name`, `description`, `price`, `originalPrice`, `stock_quantity`, `brand_id`, `category_id`, `sales_count`, `gender_id`) VALUES
(14, 'Nike Air Max 270', 'Comfortable sneakers with Air cushioning for everyday', 2580000.00, 180000.00, 40, 3, 1, 10, 3),
(15, 'Adidas Ultraboost 5.0', 'High-performance running shoes with responsive cushioning.', 100000.00, 220000.00, 19, 4, 1, 11, 3),
(16, 'Puma Suede Classic', 'Timeless suede sneakers with a retro vibe.', 1500000.00, 100000.00, 57, 5, 1, 13, 4),
(17, 'Vans Old Skool', 'Iconic skate shoes with durable canvas and suede.', 250000.00, 80000.00, 87, 6, 1, 13, 4),
(18, 'Converse Chuck Taylor High', 'Classic high-top sneakers with timeless design .', 100000.00, 70000.00, 104, 7, 1, 16, 3),
(26, 'Air-jodan', 'giày ngon', 12300000.00, 18000000.00, 4, 3, 1, 1, 3),
(27, 'Nike Air Force 1 Low', 'Đôi giày quốc dân không bao giờ lỗi thời. Form đẹp, da mềm, đi học – đi chơi – đi làm đều hợp. Đế Air êm chân, phối đồ kiểu gì cũng đẹp. Best-seller mọi thời đại.', 2490000.00, 4900003.00, 100, 3, 1, 0, 3),
(28, 'Converse Run Star Hike High', 'Đế bánh răng siêu ngầu, tôn dáng cực mạnh. Phong cách streetwear cá tính, đi lên chân là người ta biết bạn chơi hệ thời trang liền.', 2250000.00, 3000000.00, 122, 7, 1, 0, 4),
(29, 'Converse Chuck 70s Sunflower', 'Tone vàng hot trend, lên outfit cực sáng. Canvas dày, siêu bền, phiên bản 70s nên đi êm và đẹp hơn dòng Classic rất nhiều.', 1650000.00, 2888000.00, 22, 7, 1, 0, 4),
(30, 'Converse All Star Lift Platform', 'Đế độn nhẹ giúp tăng chiều cao tự nhiên 3–4cm. Form thon, dễ phối đồ, hợp cả nam lẫn nữ muốn cao và đẹp hơn một tí.', 1850000.00, 2255550.00, 33, 7, 1, 0, 3),
(31, 'Vans Sk8-Hi Black White', 'Form high-top cực iconic. Vải canvas + suede bền, đế waffle bám chắc. Đi streetwear, đi chơi, đi dạo đều hợp vibe.', 1650000.00, 2550000.00, 74, 6, 1, 0, 3),
(32, 'Vans Slip-On Checkerboard', 'Mẫu slip-on huyền thoại. Mang vào là chạy, không cần buộc dây. Checkerboard thì khỏi bàn—trend mãi không hết hot.', 1500000.00, 12333322.00, 221, 6, 1, 0, 3),
(33, 'Vans Authentic Black', 'Form thấp tối giản, nhẹ, dễ mang. Ai thích vibe basic–gọn–dễ phối thì đôi này là đúng bài.', 1350000.00, 1555000.00, 22, 6, 1, 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `core_productpromotion`
--

CREATE TABLE `core_productpromotion` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `promotion_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_productpromotion`
--

INSERT INTO `core_productpromotion` (`id`, `created_at`, `product_id`, `promotion_id`) VALUES
(1, '2025-09-29 08:58:14.924713', 14, 2),
(2, '2025-09-29 08:58:14.926703', 15, 2),
(3, '2025-09-29 08:58:14.932704', 16, 2);

-- --------------------------------------------------------

--
-- Table structure for table `core_product_colors`
--

CREATE TABLE `core_product_colors` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `color_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_product_colors`
--

INSERT INTO `core_product_colors` (`id`, `product_id`, `color_id`) VALUES
(26, 14, 1),
(29, 14, 2),
(28, 14, 4),
(30, 15, 1),
(32, 15, 11),
(33, 16, 1),
(37, 16, 4),
(35, 16, 10),
(36, 16, 11),
(38, 17, 1),
(40, 17, 4),
(41, 18, 1),
(42, 18, 2),
(60, 26, 4),
(59, 26, 10),
(61, 27, 10),
(62, 27, 11),
(64, 28, 7),
(63, 28, 8),
(65, 29, 8),
(66, 29, 9),
(67, 30, 10),
(68, 30, 11),
(69, 31, 9),
(70, 31, 10),
(71, 32, 9),
(72, 32, 10),
(73, 32, 11),
(74, 33, 11);

-- --------------------------------------------------------

--
-- Table structure for table `core_product_sizes`
--

CREATE TABLE `core_product_sizes` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `size_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_product_sizes`
--

INSERT INTO `core_product_sizes` (`id`, `product_id`, `size_id`) VALUES
(33, 14, 2),
(34, 14, 3),
(35, 14, 4),
(36, 15, 3),
(37, 15, 4),
(41, 16, 2),
(42, 16, 3),
(43, 17, 1),
(44, 17, 2),
(45, 17, 3),
(46, 18, 2),
(47, 18, 3),
(48, 18, 4),
(66, 26, 4),
(67, 26, 15),
(68, 27, 2),
(69, 27, 4),
(70, 28, 2),
(71, 28, 3),
(72, 29, 2),
(73, 29, 3),
(74, 30, 14),
(75, 30, 15),
(76, 31, 14),
(77, 31, 15),
(78, 32, 4),
(79, 32, 14),
(80, 32, 15),
(81, 33, 3),
(82, 33, 4);

-- --------------------------------------------------------

--
-- Table structure for table `core_promotion`
--

CREATE TABLE `core_promotion` (
  `id` bigint(20) NOT NULL,
  `code` varchar(20) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_promotion`
--

INSERT INTO `core_promotion` (`id`, `code`, `discount_percentage`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 'Giam10k', 10.00, '2025-09-29 15:53:00.000000', '2025-11-29 15:53:00.000000', 1, '2025-10-11 05:24:21.412924'),
(2, 'FreeShip', 20.00, '2025-09-29 15:57:00.000000', '2025-12-30 22:57:00.000000', 1, '2025-10-11 05:24:21.412924'),
(3, 'Giam50', 50.00, '2025-10-02 19:00:00.000000', '2025-12-12 07:00:00.000000', 1, '2025-10-11 05:24:21.412924'),
(4, 'Giam100', 100.00, '2025-10-11 12:18:00.000000', '2025-10-12 12:18:00.000000', 1, '2025-10-11 05:24:21.412924'),
(5, '20THANG10', 100.00, '2025-10-11 05:25:00.000000', '2025-10-11 11:30:00.000000', 1, '2025-10-11 05:25:29.470608');

-- --------------------------------------------------------

--
-- Table structure for table `core_review`
--

CREATE TABLE `core_review` (
  `id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `comment` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_review`
--

INSERT INTO `core_review` (`id`, `rating`, `title`, `comment`, `created_at`, `updated_at`, `product_id`, `user_id`, `order_id`) VALUES
(2, 5, 'Đánh giá Puma Suede Classic', 'Đôi này mặc đẹp lắm nhá', '2025-10-09 16:04:12.002189', '2025-10-09 16:04:12.002189', 16, 1, NULL),
(3, 5, 'Đánh giá Vans Old Skool', 'Đôi này khá đẹp', '2025-10-10 08:15:41.101121', '2025-10-10 08:15:41.101121', 17, 1, NULL),
(4, 5, 'Đánh giá Nike Air Max 270', 'đôi này đẹp lắm nha', '2025-10-10 14:00:09.974617', '2025-10-10 14:00:09.974617', 14, 1, NULL),
(5, 5, 'Đánh giá Adidas Ultraboost 5.0', 'đôi này xịn phết sóp ơi', '2025-10-10 15:19:32.167114', '2025-10-10 15:19:32.167114', 15, 1, NULL),
(6, 5, 'Đánh giá Converse Chuck Taylor High', 'ĐỖ quốc đạt', '2025-10-10 16:27:19.584448', '2025-10-10 16:27:19.584448', 18, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `core_shippingaddress`
--

CREATE TABLE `core_shippingaddress` (
  `id` bigint(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_shippingaddress`
--

INSERT INTO `core_shippingaddress` (`id`, `full_name`, `email`, `phone`, `address`, `city`, `district`, `ward`, `is_default`, `created_at`, `updated_at`, `user_id`) VALUES
(3, 'Trương Phi Hoàng', 'hoang@gmail.com', '0888555888', '102 Diệp Minh Châu', 'Đà Nẵng', 'Cẩm Lệ', '', 0, '2025-10-10 10:04:45.197171', '2025-11-18 10:41:32.329736', 1),
(4, 'Truong Phi Hoang', 'hoang@gmail.com', '0885522225', '102 Diệp Minh Châu', 'Đà Nẵng', 'Cẩm Lệ', 'Phường Hòa Xuân', 1, '2025-10-10 10:32:05.848758', '2025-11-18 10:41:23.332435', 1),
(5, 'ĐỖ QUỐC ĐẠT', 'ddat2405@gmail.com', '0917428309', '102 Diệp Minh Châu', 'Đà Nẵng', 'Cẩm Lệ', 'Phường Hòa Xuân', 1, '2025-10-11 05:13:47.943981', '2025-10-11 05:13:47.943981', 3);

-- --------------------------------------------------------

--
-- Table structure for table `core_size`
--

CREATE TABLE `core_size` (
  `id` bigint(20) NOT NULL,
  `value` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_size`
--

INSERT INTO `core_size` (`id`, `value`) VALUES
(1, '35'),
(2, '36'),
(3, '37'),
(4, '38'),
(15, '39'),
(14, '40');

-- --------------------------------------------------------

--
-- Table structure for table `core_user`
--

CREATE TABLE `core_user` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_user`
--

INSERT INTO `core_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `is_staff`, `is_active`, `date_joined`, `name`, `email`, `phone`, `address`, `role`, `created_at`, `city`, `district`) VALUES
(1, 'pbkdf2_sha256$720000$VsNy2Mu5A1nKdlVhXsoVT1$NAJrsBr9iuS4TH9OSP4WQD5BtpHyW7qHysmMC/Htad8=', NULL, 0, 'phihoang', '', '', 0, 1, '2025-09-10 10:18:48.206469', 'Trương Phi Hoàng', 'hoang@gmail.com', '0888555888', '102 Diệp Minh Châu', 0, '2025-09-10 10:18:48.620056', 'Đà Nẵng', 'Cẩm Lệ'),
(3, 'pbkdf2_sha256$720000$T9v56ApItAnTYuSWQLY92W$bvyfodsUJRGwysu15w7KyBY14s6mN1ba25m2nDKZb0s=', NULL, 0, 'datlo', '', '', 0, 1, '2025-10-11 05:12:15.385535', 'Đỗ Quốc Đạt', 'ddat2405@gmail.com', '0917428309', '102 Diệp Minh Châu, Phường Hòa Xuân', 0, '2025-10-11 05:12:15.849217', 'Đà Nẵng', 'Cẩm Lệ'),
(6, 'pbkdf2_sha256$720000$vHIGQ5hoWUCBOp7OLjy47L$FU+p8Q4azukRAS3d6Ug0lRBABK22Nu8DdWCpHhQulaU=', NULL, 0, 'admin', '', '', 0, 1, '2025-11-18 10:39:15.508709', 'minda admin', 'admin@gamil.com', '', '', 1, '2025-11-18 10:39:15.984461', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `core_user_groups`
--

CREATE TABLE `core_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_user_user_permissions`
--

CREATE TABLE `core_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_wishlist`
--

CREATE TABLE `core_wishlist` (
  `id` bigint(20) NOT NULL,
  `added_at` datetime(6) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_wishlist`
--

INSERT INTO `core_wishlist` (`id`, `added_at`, `product_id`, `user_id`) VALUES
(20, '2025-10-11 05:15:59.682045', 15, 3),
(21, '2025-10-11 07:14:48.959074', 17, 1),
(22, '2025-11-07 13:17:12.888942', 26, 1),
(23, '2025-11-07 13:17:13.762103', 18, 1),
(24, '2025-11-08 08:12:20.680674', 32, 3),
(25, '2025-11-08 08:12:23.437416', 30, 3);

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(2, 'auth', 'group'),
(1, 'auth', 'permission'),
(3, 'contenttypes', 'contenttype'),
(33, 'core', 'alert'),
(5, 'core', 'banner'),
(34, 'core', 'botconfig'),
(6, 'core', 'brand'),
(14, 'core', 'cart'),
(22, 'core', 'cartitem'),
(7, 'core', 'category'),
(15, 'core', 'chatbotconversation'),
(31, 'core', 'chatbotfeedback'),
(32, 'core', 'chatbotmetrics'),
(27, 'core', 'chatsession'),
(8, 'core', 'color'),
(36, 'core', 'conversationtag'),
(9, 'core', 'faq'),
(25, 'core', 'faqcategory'),
(10, 'core', 'gender'),
(21, 'core', 'image'),
(35, 'core', 'intenttraining'),
(16, 'core', 'notification'),
(17, 'core', 'order'),
(20, 'core', 'orderdetail'),
(18, 'core', 'payment'),
(19, 'core', 'product'),
(23, 'core', 'productpromotion'),
(11, 'core', 'promotion'),
(29, 'core', 'review'),
(28, 'core', 'reviewimage'),
(30, 'core', 'shippingaddress'),
(12, 'core', 'size'),
(26, 'core', 'unansweredquestion'),
(13, 'core', 'user'),
(24, 'core', 'wishlist'),
(4, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-09-10 10:16:29.946833'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-09-10 10:16:29.994492'),
(3, 'auth', '0001_initial', '2025-09-10 10:16:30.112453'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-09-10 10:16:30.134620'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-09-10 10:16:30.134620'),
(6, 'auth', '0004_alter_user_username_opts', '2025-09-10 10:16:30.148867'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-09-10 10:16:30.155919'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-09-10 10:16:30.157659'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-09-10 10:16:30.167402'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-09-10 10:16:30.177997'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-09-10 10:16:30.182979'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-09-10 10:16:30.195642'),
(13, 'auth', '0011_update_proxy_permissions', '2025-09-10 10:16:30.200521'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-09-10 10:16:30.206129'),
(15, 'core', '0001_initial', '2025-09-10 10:16:30.788826'),
(16, 'sessions', '0001_initial', '2025-09-10 10:16:30.802475'),
(17, 'core', '0002_product_sales_count', '2025-09-11 14:30:54.329161'),
(18, 'core', '0003_remove_brand_logo_url_brand_image_alter_gender_name', '2025-09-12 03:37:53.371503'),
(19, 'core', '0004_remove_product_image_remove_product_isonsale', '2025-09-14 09:11:16.790185'),
(20, 'core', '0005_alter_gender_name_remove_product_gender_and_more', '2025-09-14 13:18:31.636646'),
(21, 'core', '0006_remove_product_gender_product_genders', '2025-09-14 14:19:24.695935'),
(22, 'core', '0007_remove_product_genders_product_gender', '2025-09-14 14:29:08.967571'),
(23, 'core', '0008_alter_gender_name', '2025-09-14 14:31:57.224285'),
(24, 'core', '0009_user_city_user_district', '2025-09-16 10:20:32.256248'),
(25, 'core', '0010_orderdetail_color_orderdetail_size', '2025-09-16 14:08:01.382264'),
(26, 'core', '0011_order_payment_status', '2025-09-18 15:44:23.244848'),
(27, 'core', '0012_alter_chatbotconversation_options_and_more', '2025-09-21 10:18:46.459311'),
(28, 'core', '0013_faqcategory_alter_faq_updated_at_faq_category_fk_and_more', '2025-09-23 08:02:37.495770'),
(29, 'core', '0014_remove_chatsession_user_and_more', '2025-09-29 08:42:50.466529'),
(30, 'core', '0015_delete_faq_delete_faqcategory', '2025-09-29 09:06:09.284317'),
(31, 'core', '0016_product_product_discount_percentage', '2025-09-29 09:44:11.384980'),
(32, 'core', '0017_remove_product_created_at_and_more', '2025-09-29 09:53:13.950372'),
(33, 'core', '0018_order_discount_amount_order_promotion_code_and_more', '2025-10-02 08:58:48.516004'),
(34, 'core', '0019_review_reviewimage', '2025-10-03 05:42:24.545344'),
(35, 'core', '0020_remove_reviewimage_review_delete_review_and_more', '2025-10-03 06:04:12.871005'),
(36, 'core', '0021_review', '2025-10-09 15:02:20.121541'),
(37, 'core', '0022_remove_product_rating_reviews', '2025-10-09 15:53:48.773190'),
(38, 'core', '0023_shippingaddress_order_shipping_address', '2025-10-10 09:34:07.327224'),
(39, 'core', '0024_notification', '2025-10-10 13:03:51.793229'),
(40, 'core', '0025_add_confirmed_status', '2025-10-10 13:42:27.924605'),
(41, 'core', '0026_alter_notification_type', '2025-10-10 14:08:30.261986'),
(42, 'core', '0027_notification_action_button_text_and_more', '2025-10-10 14:13:02.835074'),
(43, 'core', '0028_alter_review_unique_together_review_order_and_more', '2025-10-10 16:32:32.020840'),
(44, 'core', '0029_alter_promotion_options_promotion_created_at', '2025-10-11 05:24:21.467299'),
(45, 'core', '0030_chatbotconversation_chatbotfeedback', '2025-10-12 07:33:29.566756'),
(46, 'core', '0031_update_chatbot_feedback', '2025-11-07 13:59:43.051578'),
(47, 'core', '0031_chatbotmetrics', '2025-11-12 07:46:16.572511'),
(48, 'core', '0032_alert_botconfig_intenttraining_and_more', '2025-11-14 13:17:29.539449');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('1jry5qibnjj693qyh6l80b73o3k2ydyi', 'eyJhd2FpdGluZ19zdWdnZXN0aW9uIjpmYWxzZSwiYXdhaXRpbmdfdGV4dCI6IiJ9:1v395E:3KNaBy98bO-UBfmoshPwaFRGu03WRxtUZOP2V2pGLWw', '2025-10-13 08:18:08.357665'),
('2j2nwimoax8ecmlm515o2iyizg7eghst', '.eJylkMFOhDAQhl-FzJnQsmwFe9M96ANoPJgN6ZYGGqAlbTGuG97dFhZdjXvy0qTzz_z_fHMCrpUT764cjK5G7izQ1xPICmhaxKBYL4DCTqs3YayIds3I2-iJHTttokdZNxDDYCT3TYRgjBMcg-xZLcrRdH6wcW6gCKWbPPFaktLCN6FeVJKhc2A591u0ZswRS0IISAZV-5BOqtb7rUMoLXzRyg8R9oXsxv-yPDyhnt3CPvZg3mKW7zvGW19_aaQTQToYpqoLruDFOmFLrkflgBZTfL4B-brBXSUrZqPnzhl20Nq6iCT4G3-D8f_4F__V3llyjZz8IL-EjmEbNtqmf-M_GHa8pF8Sf7Pn0376BFEwpf0:1v1j0Q:S9bM2sHRwCOfFs9aD4qBrukz-vwdhAFBKyTqfUP2w_c', '2025-10-09 10:15:18.881346'),
('4dt3wnx00mez023hj1r3oz4n3q4w11qs', '.eJylkMFOhDAQhl-FzJnQsmwFe9M96ANoPJgN6ZYGGqAlbTGuG97dFhZdjXvy0qTzz_z_fHMCrpUT764cjK5G7izQ1xPICmhaxKBYL4DCTqs3YayIds3I2-iJHTttokdZNxDDYCT3TYRgjBMcg-xZLcrRdH6wcW6gCKWbPPFaktLCN6FeVJKhc2A591u0ZswRS0IISAZV-5BOqtb7rUMoLXzRyg8R9oXsxv-yPDyhnt3CPvZg3mKW7zvGW19_aaQTQToYpqoLruDFOmFLrkflgBZTfL4B-brBXSUrZqPnzhl20Nq6iCT4G3-D8f_4F__V3llyjZz8IL-EjmEbNtqmf-M_GHa8pF8Sf7Pn0376BFEwpf0:1v1izj:KyF_Ph8-z-_qxXylKClb8ack6rCbIn7PCIDY8T1l59s', '2025-10-09 10:14:35.430817'),
('764nwu57yx2vpj5tk3h5ityw4l1u16x8', '.eJylkU1rwzAMQP-K0TkkcZs0WW7tDjttDMbYYYzgxqY1dZzMdli70v8-OU0_BumpPshYEk9-aA9Vo53YurI1De8qZ6H43IPkUNAkAM1qAQW8yI0gc2nIM9uSSRZDAK2RFZZoGuMJ4wBkzVai7IzC_rVzbRFFdJKFWAtpkWNTVAsuWTTMKft-G3k0khGM3LDVK2QrqTdIObVGNMGklb_Cfw6mM3xNMx9y-ApQQDWmrywUqzaY_1hLJ_BeqE74jqVhmg8acAgGvfSsN-eSM0velTNs2TTWkTS8cpzEdzoe-Se8s-ktz_Sf56CI4QFD4n-U0HHjJ8N216bHiRfX2dn1tasZeesEF-RRMWtldRHN7_T07B49kKe3PGdj-xwV61eIl2l-9IinnwgHTHx3wuzKU1r3i_4DTIPepw:1v1ieP:JdRjnmAWW2EHSzB9sC5xvQT0pxpAGMbQlZpDI2y_7wY', '2025-10-09 09:52:33.464739'),
('9wzz0u5fo5jf2anf1cl30w52e90xi8kd', '.eJylkT1vwjAQQP-KdXOUD5IQmg06dGpVqao6VCgysQUWjh3ZjkqL-O89h0BpGyY8nGXf6Z2fbw-1Vo7vXNUazbraWSjf9yAYlEkWgKINhxKexJaTuTDkke7IpIghgNaIGlNJHuMK4wBEQ9e86ozE-o1zbRlFyaQIMRcm5QyLooYzQaOhT9XX28ijkYxg5IatWiNbCrVFyqk0SjK8tOKL-8dBOsVTWvgwg2WAAlKbPrOQtN7i_dtGOI77QnbcV6wMVWzQ8CQqua1q3SkHZXoIBt38rDtnglFLXqUzdKW1dSQPL5wn8Y3OR_4J72x-zTv_5T0oY7jDkPkXZcn4DzwY-nlpfuz41704u0_P7s9dQ8lLxxkn95JaK-of8dmN3p7dowdyes17OjbvUdF-xLgZ_aFGvH3H_xNfHr4B9jXn8Q:1v1j19:srKEKgXqJchXGo-jdW-A5qkCNUZ6oBHLMsHg0R14JPw', '2025-10-09 10:16:03.443158'),
('bptineqqsc2oxfplh84ssc0puy2uyzhv', 'eyJzYWxlc19wcmVmcyI6e319:1v399f:LICCUOmPTKwxbCpX6OAjFjDvgN7FP9NvWxLcnIRJZJE', '2025-10-13 08:22:43.866984'),
('dapb3wfegsxnl7bafzx5yffz3pay3hrn', '.eJylkclqwzAQhl9FzNl43-pb0kNPLYVSeighKJZIhOUFSaZpg9-9I8fZwDlFhxHS_HyjDx2gbBvD92bdqZb1pdFQfB9AMCiC2IGG1hwKeBMVJwuhyCvdkzDzwYFOiRJbQeLjcn0HRE23fN0rifmdMV3heUGYudhzgyLHkFdzJqg3zVmPee1ZNJIRjFy3a7bIlqKpkHKKekGMl1r8cfs4iFI8RZktOawcFJCtGjtLScsK7792wnDcl7LnNrFRtGGTBgzOpJec9RZMMKrJpzSKbtpWG5K4V46h_6DjkX_CG53c80xuPCdFLE9YYvuiOJg3flH099r0OPHimp5d3_uako-eM06eJdValBfR_EFPyx7REzm655nO_ees2PiFuKn2p5nxtBNhWA3_USLXdg:1v1iVq:BrnHawHtI_USJ7TY9THy8mYysItEZN5jzfFRZKkoQS8', '2025-10-09 09:43:42.774180'),
('fxlcn8umdoymju12fsi2bccf1nidxdgb', '.eJylkstuwjAQRX_F8jrKO4RmB1101apSVXVRVZGJLbBw7NQPFYr4945DoNCGFVmMFc_VGZ84O9woadnG1p1W1DXW4Op9hznFVZIHWJKW4Qo_8TVDM67RI9mgtIxxgDvNG2glRQxPGAeYt2TJaqcF5FfWdlUUJWkZQi9MqimEopZRTqJhTt3nTeTRQAYwcMNOLoEtuFwD5RiNkhw2Df9m_nA4m8BbVvoyxR8BCAil-85ckGYN-28rbhmsc-GYTyw0kXTQ8CQimKkb5aTFVbYPBt3ipDujnBKDXoXVZKGUsagIz5zT-EbnA_-It6a45l1ceA_KUO6g5P5EeTL-BR402Z6bHyb-dS9P7pOT-7NrCXpxjDJ0L4gxvPkVn97o7dk9eiBn17wnY_c9KtpfMSxafckRbz_x_41D4NMxva2PMel_jP0PS8vvIg:1v1ils:juhM6yajw2voAnNwuWWiNz-yoUk2HoWbOLVFV4V7UHk', '2025-10-09 10:00:16.551187'),
('g5nzm53m9u1o6s43xdzjjrf79wfp9cg4', '.eJylkclqwzAQhl9FzNl43-pb0kNPLYVSeighKJZIhOUFSaZpg9-9I8fZwDlFhxHS_HyjDx2gbBvD92bdqZb1pdFQfB9AMCiC2IGG1hwKeBMVJwuhyCvdkzDzwYFOiRJbQeLjcn0HRE23fN0rifmdMV3heUGYudhzgyLHkFdzJqg3zVmPee1ZNJIRjFy3a7bIlqKpkHKKekGMl1r8cfs4iFI8RZktOawcFJCtGjtLScsK7792wnDcl7LnNrFRtGGTBgzOpJec9RZMMKrJpzSKbtpWG5K4V46h_6DjkX_CG53c80xuPCdFLE9YYvuiOJg3flH099r0OPHimp5d3_uako-eM06eJdValBfR_EFPyx7REzm655nO_ees2PiFuKn2p5nxtBNhWA3_USLXdg:1v1ig9:TS3rkzuyMTt9IDlY4kJAA2ZtAWJrQ6xOKR3xHo36fSY', '2025-10-09 09:54:21.792387'),
('iqtsj1ezm5ivaqysvvde3uo90iv2taq5', '.eJylkMFOwzAMhl-l8rlq022lpTfYAR4AxAFNldeGNmqWVEkKjGnvjtOtrCA4cYlk_87_-_MB8A2FE6op7dA03DqhFRQvKC0PL5rj7w4KgBAqrXxR9kbXQ-UsFM8HEDUUSR6Cwh2nsbVWr9xYHqzboeqCB9xLbYJ70bRk0BtR0VCaMsYiFoLYYcPLwUj62DrXF3GcLLKItCgpchqKd7wWGJ8Dy3HexlPGGHFK8AFRrxoKkUJ15Dd9ipOcmlZ8cL8vLK-oWmb-8f3lNWw8GFmM8q3EqqP-Uysc99LWoKpnXN4LJbdlpQdFd8mP4fkG6dcNbmpRow0epTO41dq6II3YBX_B2P_4T_6TvbPpX-TpN_I5dAgrv9Eq-R3_zuB-Tn9K_MmeHTfHT6vAtxM:1v1j0v:I6hjQ8Cj8Amz-kVR8lw9nD8NughvUWPAK8Zzu9CASsM', '2025-10-09 10:15:49.737505'),
('jt90z3t2esge3qiomiw10cj8zbefvife', '.eJyrVipOzEktji8oSk0rVrKqVkpPzUtJLVKyUvJLzFXSUSrOrEoFckwMgeyk0pT01JL43Mw8JStzIwMgQIglVihZGRpYgARrawGjnxp7:1v398h:WmwcIlqO05iFzoZ3vf7DibQJX3hvapVi_g9aK005c6g', '2025-10-13 08:21:43.364247'),
('kk9ntiw7z2d6d24qqr1uo5cnnzw94jsb', 'eyJhd2FpdGluZ19zdWdnZXN0aW9uIjpmYWxzZSwiYXdhaXRpbmdfdGV4dCI6IiJ9:1v1NTb:MdhmgXmeMg9PvMPnb3iu_ll2FrEHz-q3XqkCK-p-XyE', '2025-10-08 11:15:59.275067'),
('ljql0v2lbjcgo68k5zdqw9m0wczlceuw', '.eJylkMFOhDAQhl-FzJnQsmwFe9M96ANoPJgN6ZYGGqAlbTGuG97dFhZdjXvy0qTzz_z_fHMCrpUT764cjK5G7izQ1xPICmhaxKBYL4DCTqs3YayIds3I2-iJHTttokdZNxDDYCT3TYRgjBMcg-xZLcrRdH6wcW6gCKWbPPFaktLCN6FeVJKhc2A591u0ZswRS0IISAZV-5BOqtb7rUMoLXzRyg8R9oXsxv-yPDyhnt3CPvZg3mKW7zvGW19_aaQTQToYpqoLruDFOmFLrkflgBZTfL4B-brBXSUrZqPnzhl20Nq6iCT4G3-D8f_4F__V3llyjZz8IL-EjmEbNtqmf-M_GHa8pF8Sf7Pn0376BFEwpf0:1v1ilR:HUbDPkn-NQCunIOeZhhtOMdElQ7RcNpQZqXNSS66Iak', '2025-10-09 09:59:49.302385'),
('m46shtdb036ceolc3ooub14tf4dhkk4z', 'eyJzYWxlc19wcmVmcyI6e319:1v3998:xAKJHCz-7b8oBlMgwO4L0BbnYILnz3KiJczSg5cZGF4', '2025-10-13 08:22:10.455065'),
('netl8a94ho0i9zjv8huimft95nd3f4tv', 'eyJhd2FpdGluZ19zdWdnZXN0aW9uIjpmYWxzZSwiYXdhaXRpbmdfdGV4dCI6IiJ9:1v1NBL:-NqNIz3K2Mc014a4hyI-sEsvPrpz6G-9f203i2urzcs', '2025-10-08 10:57:07.579776'),
('q00gbrfa52ag88pl2zbe35isns8rs63a', 'eyJzYWxlc19wcmVmcyI6e30sImF3YWl0aW5nX2ZpZWxkIjoiZ2VuZGVyIn0:1v39C5:plftx6itkCK--c5MzPRXRfw-rLEwtgpfb_haM3o7hyE', '2025-10-13 08:25:13.036200'),
('qokek2xlorgmcfql1l86i0d74xr7k0ic', 'eyJhd2FpdGluZ19zdWdnZXN0aW9uIjpmYWxzZSwiYXdhaXRpbmdfdGV4dCI6IiJ9:1v1N0L:rm5mbJ7B5Fxj3Oi4OEOmXOVbxjWNNt9hggfD8q1jwuU', '2025-10-08 10:45:45.271322'),
('rsc6b4xcfplrk9ke1vtm4dsx9q6921xh', 'eyJhd2FpdGluZ19zdWdnZXN0aW9uIjpmYWxzZSwiYXdhaXRpbmdfdGV4dCI6IiJ9:1v1ic3:Ej8075Hyb0PIEhz_ch7OC9Ao2g3y3Y5wjRYz0HkUL64', '2025-10-09 09:50:07.798786'),
('valibor5emvnxiyeib2n2u79gununwha', 'eyJhd2FpdGluZ19zdWdnZXN0aW9uIjpmYWxzZSwiYXdhaXRpbmdfdGV4dCI6IiJ9:1v1MsP:91h1Ug_n70h5BjY0BRjWSZxN75JNSrq9IS-EGay1RXo', '2025-10-08 10:37:33.456072'),
('vfdzn2of5bdntg62v07dwutj3v1pcrwp', 'eyJzYWxlc19wcmVmcyI6e319:1v399N:Nf29SHPtF14hMQMX74sOLmLqCFAeJyLoSp7G21V6Fvs', '2025-10-13 08:22:25.679905'),
('wlsnnnb3iqbzi1bngvm4pzlbhkh4hb0y', '.eJylkctugzAQRX_FmjXiFVwouySLdtOuWnVRRcgBCyyesk2VNOLfO7wSKpVu4sVYnrm6d458gbiuND_pqJF10sZaQfh5AZFA6HgGVKzkEMKryDnZCkle2Im4vg0GNFLEOHKojce0DRAlS3nUygL1mdZNaFmO65s4M50wQJFV8kQwa8qJBr2yemt0RmP0NZsqRe9CVDm6zFLL8bCpxDfvl4PNA742fl8COBgIUNRymOwKFufY_8iE5njvipb3iqNkVTJhQGdMePSKt01EwhR5L7Rkx7pWmlBzwejadzKO_rO9VnSNk_7inBCxPGLx-o0852_iJ8nOS9Ix8cYaXFn3dfXFpeJkn7VxTt7YGb3Is0izGzCl9_HOGUPEmNAHrFEHq787oP_zxQviORO6Q_cD2I7clg:1v1iUf:rvifnPXqHq6bsFEjBIYFuyc_QrMm5X0ypiPVj_0Tuqk', '2025-10-09 09:42:29.383293'),
('xuv8vbyphferwi6eodpgbaobvdgcgpl4', '.eJylkclqwzAQhl9FzNl43-pb0kNPLYVSeighKJZIhOUFSaZpg9-9I8fZwDlFhxHS_HyjDx2gbBvD92bdqZb1pdFQfB9AMCiC2IGG1hwKeBMVJwuhyCvdkzDzwYFOiRJbQeLjcn0HRE23fN0rifmdMV3heUGYudhzgyLHkFdzJqg3zVmPee1ZNJIRjFy3a7bIlqKpkHKKekGMl1r8cfs4iFI8RZktOawcFJCtGjtLScsK7792wnDcl7LnNrFRtGGTBgzOpJec9RZMMKrJpzSKbtpWG5K4V46h_6DjkX_CG53c80xuPCdFLE9YYvuiOJg3flH099r0OPHimp5d3_uako-eM06eJdValBfR_EFPyx7REzm655nO_ees2PiFuKn2p5nxtBNhWA3_USLXdg:1v1icZ:W934y9Wj2_aVLFjrjLX3baFQKcI2Tk7PZ5kfkxsBtUw', '2025-10-09 09:50:39.919055');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `core_alert`
--
ALTER TABLE `core_alert`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `core_banner`
--
ALTER TABLE `core_banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `core_botconfig`
--
ALTER TABLE `core_botconfig`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `core_brand`
--
ALTER TABLE `core_brand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `core_cart`
--
ALTER TABLE `core_cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `core_cartitem`
--
ALTER TABLE `core_cartitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_cartitem_cart_id_5256d769_fk_core_cart_id` (`cart_id`),
  ADD KEY `core_cartitem_product_id_2640c4a2_fk_core_product_id` (`product_id`);

--
-- Indexes for table `core_category`
--
ALTER TABLE `core_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `core_chatbotconversation`
--
ALTER TABLE `core_chatbotconversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_chatbotconversation_user_id_a7c6968a_fk_core_user_id` (`user_id`);

--
-- Indexes for table `core_chatbotfeedback`
--
ALTER TABLE `core_chatbotfeedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `core_chatbotmetrics`
--
ALTER TABLE `core_chatbotmetrics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`);

--
-- Indexes for table `core_color`
--
ALTER TABLE `core_color`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `value` (`value`);

--
-- Indexes for table `core_conversationtag`
--
ALTER TABLE `core_conversationtag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_id` (`conversation_id`,`tag_name`);

--
-- Indexes for table `core_gender`
--
ALTER TABLE `core_gender`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `core_gender_name_874b99e0_uniq` (`name`);

--
-- Indexes for table `core_image`
--
ALTER TABLE `core_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_image_product_id_36d4c60d_fk_core_product_id` (`product_id`);

--
-- Indexes for table `core_intenttraining`
--
ALTER TABLE `core_intenttraining`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `intent_name` (`intent_name`);

--
-- Indexes for table `core_notification`
--
ALTER TABLE `core_notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_notification_related_order_id_031117a4_fk_core_order_id` (`related_order_id`),
  ADD KEY `core_notification_user_id_6e341aac_fk_core_user_id` (`user_id`),
  ADD KEY `core_notification_related_product_id_332f13b7_fk_core_product_id` (`related_product_id`);

--
-- Indexes for table `core_order`
--
ALTER TABLE `core_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_order_user_id_b03bbffd_fk_core_user_id` (`user_id`),
  ADD KEY `core_order_shipping_address_id_8c054f15_fk_core_ship` (`shipping_address_id`);

--
-- Indexes for table `core_orderdetail`
--
ALTER TABLE `core_orderdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_orderdetail_order_id_51e75d3b_fk_core_order_id` (`order_id`),
  ADD KEY `core_orderdetail_product_id_2454bf3d_fk_core_product_id` (`product_id`);

--
-- Indexes for table `core_payment`
--
ALTER TABLE `core_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_payment_order_id_71322fb0_fk_core_order_id` (`order_id`);

--
-- Indexes for table `core_product`
--
ALTER TABLE `core_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_product_brand_id_a97b95f2_fk_core_brand_id` (`brand_id`),
  ADD KEY `core_product_category_id_b9d8ff9f_fk_core_category_id` (`category_id`),
  ADD KEY `core_product_gender_id_00937238_fk_core_gender_id` (`gender_id`);

--
-- Indexes for table `core_productpromotion`
--
ALTER TABLE `core_productpromotion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_productpromotion_product_id_206b1ec7_fk_core_product_id` (`product_id`),
  ADD KEY `core_productpromotion_promotion_id_ce5b5c35_fk_core_promotion_id` (`promotion_id`);

--
-- Indexes for table `core_product_colors`
--
ALTER TABLE `core_product_colors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `core_product_colors_product_id_color_id_6cf09cce_uniq` (`product_id`,`color_id`),
  ADD KEY `core_product_colors_color_id_017fca6f_fk_core_color_id` (`color_id`);

--
-- Indexes for table `core_product_sizes`
--
ALTER TABLE `core_product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `core_product_sizes_product_id_size_id_e79df346_uniq` (`product_id`,`size_id`),
  ADD KEY `core_product_sizes_size_id_a719335e_fk_core_size_id` (`size_id`);

--
-- Indexes for table `core_promotion`
--
ALTER TABLE `core_promotion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `core_review`
--
ALTER TABLE `core_review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `core_review_product_id_user_id_order_id_54b4f2d7_uniq` (`product_id`,`user_id`,`order_id`),
  ADD KEY `core_review_user_id_b6106194_fk_core_user_id` (`user_id`),
  ADD KEY `core_review_product_id_27ba91fa` (`product_id`),
  ADD KEY `core_review_order_id_267b2e92_fk_core_order_id` (`order_id`);

--
-- Indexes for table `core_shippingaddress`
--
ALTER TABLE `core_shippingaddress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_shippingaddress_user_id_da3e3bad_fk_core_user_id` (`user_id`);

--
-- Indexes for table `core_size`
--
ALTER TABLE `core_size`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `value` (`value`);

--
-- Indexes for table `core_user`
--
ALTER TABLE `core_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `core_user_groups`
--
ALTER TABLE `core_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `core_user_groups_user_id_group_id_c82fcad1_uniq` (`user_id`,`group_id`),
  ADD KEY `core_user_groups_group_id_fe8c697f_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `core_user_user_permissions`
--
ALTER TABLE `core_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `core_user_user_permissions_user_id_permission_id_73ea0daa_uniq` (`user_id`,`permission_id`),
  ADD KEY `core_user_user_permi_permission_id_35ccf601_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `core_wishlist`
--
ALTER TABLE `core_wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `core_wishlist_product_id_ed80ff10_fk_core_product_id` (`product_id`),
  ADD KEY `core_wishlist_user_id_6ebbf187_fk_core_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `core_alert`
--
ALTER TABLE `core_alert`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_banner`
--
ALTER TABLE `core_banner`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_botconfig`
--
ALTER TABLE `core_botconfig`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_brand`
--
ALTER TABLE `core_brand`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `core_cart`
--
ALTER TABLE `core_cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `core_cartitem`
--
ALTER TABLE `core_cartitem`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `core_category`
--
ALTER TABLE `core_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `core_chatbotconversation`
--
ALTER TABLE `core_chatbotconversation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=308;

--
-- AUTO_INCREMENT for table `core_chatbotfeedback`
--
ALTER TABLE `core_chatbotfeedback`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `core_chatbotmetrics`
--
ALTER TABLE `core_chatbotmetrics`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `core_color`
--
ALTER TABLE `core_color`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `core_conversationtag`
--
ALTER TABLE `core_conversationtag`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_gender`
--
ALTER TABLE `core_gender`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `core_image`
--
ALTER TABLE `core_image`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `core_intenttraining`
--
ALTER TABLE `core_intenttraining`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_notification`
--
ALTER TABLE `core_notification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `core_order`
--
ALTER TABLE `core_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `core_orderdetail`
--
ALTER TABLE `core_orderdetail`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `core_payment`
--
ALTER TABLE `core_payment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `core_product`
--
ALTER TABLE `core_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `core_productpromotion`
--
ALTER TABLE `core_productpromotion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `core_product_colors`
--
ALTER TABLE `core_product_colors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `core_product_sizes`
--
ALTER TABLE `core_product_sizes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `core_promotion`
--
ALTER TABLE `core_promotion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `core_review`
--
ALTER TABLE `core_review`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `core_shippingaddress`
--
ALTER TABLE `core_shippingaddress`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `core_size`
--
ALTER TABLE `core_size`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `core_user`
--
ALTER TABLE `core_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `core_user_groups`
--
ALTER TABLE `core_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_user_user_permissions`
--
ALTER TABLE `core_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_wishlist`
--
ALTER TABLE `core_wishlist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `core_cart`
--
ALTER TABLE `core_cart`
  ADD CONSTRAINT `core_cart_user_id_2ebeb843_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_cartitem`
--
ALTER TABLE `core_cartitem`
  ADD CONSTRAINT `core_cartitem_cart_id_5256d769_fk_core_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `core_cart` (`id`),
  ADD CONSTRAINT `core_cartitem_product_id_2640c4a2_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`);

--
-- Constraints for table `core_chatbotconversation`
--
ALTER TABLE `core_chatbotconversation`
  ADD CONSTRAINT `core_chatbotconversation_user_id_a7c6968a_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_conversationtag`
--
ALTER TABLE `core_conversationtag`
  ADD CONSTRAINT `core_conversationtag_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `core_chatbotconversation` (`id`);

--
-- Constraints for table `core_image`
--
ALTER TABLE `core_image`
  ADD CONSTRAINT `core_image_product_id_36d4c60d_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`);

--
-- Constraints for table `core_notification`
--
ALTER TABLE `core_notification`
  ADD CONSTRAINT `core_notification_related_order_id_031117a4_fk_core_order_id` FOREIGN KEY (`related_order_id`) REFERENCES `core_order` (`id`),
  ADD CONSTRAINT `core_notification_related_product_id_332f13b7_fk_core_product_id` FOREIGN KEY (`related_product_id`) REFERENCES `core_product` (`id`),
  ADD CONSTRAINT `core_notification_user_id_6e341aac_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_order`
--
ALTER TABLE `core_order`
  ADD CONSTRAINT `core_order_shipping_address_id_8c054f15_fk_core_ship` FOREIGN KEY (`shipping_address_id`) REFERENCES `core_shippingaddress` (`id`),
  ADD CONSTRAINT `core_order_user_id_b03bbffd_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_orderdetail`
--
ALTER TABLE `core_orderdetail`
  ADD CONSTRAINT `core_orderdetail_order_id_51e75d3b_fk_core_order_id` FOREIGN KEY (`order_id`) REFERENCES `core_order` (`id`),
  ADD CONSTRAINT `core_orderdetail_product_id_2454bf3d_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`);

--
-- Constraints for table `core_payment`
--
ALTER TABLE `core_payment`
  ADD CONSTRAINT `core_payment_order_id_71322fb0_fk_core_order_id` FOREIGN KEY (`order_id`) REFERENCES `core_order` (`id`);

--
-- Constraints for table `core_product`
--
ALTER TABLE `core_product`
  ADD CONSTRAINT `core_product_brand_id_a97b95f2_fk_core_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `core_brand` (`id`),
  ADD CONSTRAINT `core_product_category_id_b9d8ff9f_fk_core_category_id` FOREIGN KEY (`category_id`) REFERENCES `core_category` (`id`),
  ADD CONSTRAINT `core_product_gender_id_00937238_fk_core_gender_id` FOREIGN KEY (`gender_id`) REFERENCES `core_gender` (`id`);

--
-- Constraints for table `core_productpromotion`
--
ALTER TABLE `core_productpromotion`
  ADD CONSTRAINT `core_productpromotion_product_id_206b1ec7_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`),
  ADD CONSTRAINT `core_productpromotion_promotion_id_ce5b5c35_fk_core_promotion_id` FOREIGN KEY (`promotion_id`) REFERENCES `core_promotion` (`id`);

--
-- Constraints for table `core_product_colors`
--
ALTER TABLE `core_product_colors`
  ADD CONSTRAINT `core_product_colors_color_id_017fca6f_fk_core_color_id` FOREIGN KEY (`color_id`) REFERENCES `core_color` (`id`),
  ADD CONSTRAINT `core_product_colors_product_id_a10d8ed9_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`);

--
-- Constraints for table `core_product_sizes`
--
ALTER TABLE `core_product_sizes`
  ADD CONSTRAINT `core_product_sizes_product_id_10c54ea0_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`),
  ADD CONSTRAINT `core_product_sizes_size_id_a719335e_fk_core_size_id` FOREIGN KEY (`size_id`) REFERENCES `core_size` (`id`);

--
-- Constraints for table `core_review`
--
ALTER TABLE `core_review`
  ADD CONSTRAINT `core_review_order_id_267b2e92_fk_core_order_id` FOREIGN KEY (`order_id`) REFERENCES `core_order` (`id`),
  ADD CONSTRAINT `core_review_product_id_27ba91fa_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`),
  ADD CONSTRAINT `core_review_user_id_b6106194_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_shippingaddress`
--
ALTER TABLE `core_shippingaddress`
  ADD CONSTRAINT `core_shippingaddress_user_id_da3e3bad_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_user_groups`
--
ALTER TABLE `core_user_groups`
  ADD CONSTRAINT `core_user_groups_group_id_fe8c697f_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `core_user_groups_user_id_70b4d9b8_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_user_user_permissions`
--
ALTER TABLE `core_user_user_permissions`
  ADD CONSTRAINT `core_user_user_permi_permission_id_35ccf601_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `core_user_user_permissions_user_id_085123d3_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);

--
-- Constraints for table `core_wishlist`
--
ALTER TABLE `core_wishlist`
  ADD CONSTRAINT `core_wishlist_product_id_ed80ff10_fk_core_product_id` FOREIGN KEY (`product_id`) REFERENCES `core_product` (`id`),
  ADD CONSTRAINT `core_wishlist_user_id_6ebbf187_fk_core_user_id` FOREIGN KEY (`user_id`) REFERENCES `core_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
