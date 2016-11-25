-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 25-Nov-2016 às 16:46
-- Versão do servidor: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `watterizer`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `advertencia`
--

CREATE TABLE `advertencia` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(50) NOT NULL,
  `mensagem` varchar(2000) NOT NULL,
  `data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `arduino`
--

CREATE TABLE `arduino` (
  `id` int(11) NOT NULL,
  `id_setor` int(11) NOT NULL,
  `localizacao` varchar(100) DEFAULT NULL,
  `id_computador_responsavel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `arduino`
--

INSERT INTO `arduino` (`id`, `id_setor`, `localizacao`, `id_computador_responsavel`) VALUES
(6, 1, 'null', 7);

-- --------------------------------------------------------

--
-- Estrutura da tabela `equipamento`
--

CREATE TABLE `equipamento` (
  `id` int(11) NOT NULL,
  `mac` varchar(20) DEFAULT NULL,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `posicionado` tinyint(1) NOT NULL,
  `id_arduino` int(11) DEFAULT NULL,
  `id_setor` int(11) NOT NULL,
  `numero_porta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `equipamento`
--

INSERT INTO `equipamento` (`id`, `mac`, `nome`, `descricao`, `posicionado`, `id_arduino`, `id_setor`, `numero_porta`) VALUES
(7, '70-54-D2-C6-A7-7E', 'LAB10-07', 'null', 0, 6, 1, 1),
(8, 'null', 'Roteador', 'beep beep', 0, 6, 1, 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `gasto`
--

CREATE TABLE `gasto` (
  `id` int(11) NOT NULL,
  `gasto` longblob,
  `data` date NOT NULL,
  `id_arduino` int(11) NOT NULL,
  `ultimo_update` time NOT NULL,
  `id_equipamento` int(11) DEFAULT NULL,
  `custo` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfil`
--

CREATE TABLE `perfil` (
  `id` int(11) NOT NULL,
  `perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `perfil`
--

INSERT INTO `perfil` (`id`, `perfil`) VALUES
(1, 'Administrador'),
(2, 'Funcionário');

-- --------------------------------------------------------

--
-- Estrutura da tabela `perguntasecreta`
--

CREATE TABLE `perguntasecreta` (
  `id` int(11) NOT NULL,
  `pergunta` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `perguntasecreta`
--

INSERT INTO `perguntasecreta` (`id`, `pergunta`) VALUES
(1, 'Bolo de que?'),
(2, 'Nescau ou Toddy?');

-- --------------------------------------------------------

--
-- Estrutura da tabela `setor`
--

CREATE TABLE `setor` (
  `id` int(11) NOT NULL,
  `setor` varchar(255) NOT NULL,
  `canvas` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `setor`
--

INSERT INTO `setor` (`id`, `setor`, `canvas`) VALUES
(1, 'Informática', ''),
(2, 'RH', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `username` varchar(54) DEFAULT NULL,
  `senha` varchar(35) DEFAULT NULL,
  `email` varchar(35) DEFAULT NULL,
  `nome` varchar(50) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `hora_entrada` time DEFAULT NULL,
  `id_perfil` int(11) NOT NULL,
  `id_setor` int(11) NOT NULL,
  `id_pergunta` int(11) DEFAULT NULL,
  `resposta_pergunta` varchar(140) DEFAULT NULL,
  `token_web` varchar(16) DEFAULT NULL,
  `token_desktop` varchar(16) DEFAULT NULL,
  `hora_saida` time NOT NULL,
  `hora_intervalo` time NOT NULL,
  `data_exclusao` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `username`, `senha`, `email`, `nome`, `telefone`, `hora_entrada`, `id_perfil`, `id_setor`, `id_pergunta`, `resposta_pergunta`, `token_web`, `token_desktop`, `hora_saida`, `hora_intervalo`, `data_exclusao`) VALUES
(1, 'admin', 'WCwLwn04k8xqKrTWuBCx8Q==', 'administrador@admin.com', 'Adminstrador', '(11) 98765-4321', '13:00:00', 1, 1, 2, 'Ovomaltine', '9aTKf3iHvvgjFmlW', 'dFI2YD3RPWPkNXWL', '17:00:00', '15:00:00', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertencia`
--
ALTER TABLE `advertencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `arduino`
--
ALTER TABLE `arduino`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_setor` (`id_setor`,`id_computador_responsavel`),
  ADD KEY `id_computador_responsavel` (`id_computador_responsavel`);

--
-- Indexes for table `equipamento`
--
ALTER TABLE `equipamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_arduino` (`id_arduino`),
  ADD KEY `id_setor` (`id_setor`);

--
-- Indexes for table `gasto`
--
ALTER TABLE `gasto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_arduino` (`id_arduino`),
  ADD KEY `id_equipamento` (`id_equipamento`);

--
-- Indexes for table `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perguntasecreta`
--
ALTER TABLE `perguntasecreta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `setor`
--
ALTER TABLE `setor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_perfil` (`id_perfil`),
  ADD KEY `id_arduino` (`id_setor`),
  ADD KEY `id_pergunta` (`id_pergunta`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advertencia`
--
ALTER TABLE `advertencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `arduino`
--
ALTER TABLE `arduino`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `equipamento`
--
ALTER TABLE `equipamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `gasto`
--
ALTER TABLE `gasto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `perfil`
--
ALTER TABLE `perfil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `perguntasecreta`
--
ALTER TABLE `perguntasecreta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `setor`
--
ALTER TABLE `setor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `advertencia`
--
ALTER TABLE `advertencia`
  ADD CONSTRAINT `advertencia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `arduino`
--
ALTER TABLE `arduino`
  ADD CONSTRAINT `arduino_ibfk_1` FOREIGN KEY (`id_setor`) REFERENCES `setor` (`id`),
  ADD CONSTRAINT `arduino_ibfk_2` FOREIGN KEY (`id_computador_responsavel`) REFERENCES `equipamento` (`id`);

--
-- Limitadores para a tabela `equipamento`
--
ALTER TABLE `equipamento`
  ADD CONSTRAINT `equipamento_ibfk_1` FOREIGN KEY (`id_arduino`) REFERENCES `arduino` (`id`),
  ADD CONSTRAINT `equipamento_ibfk_2` FOREIGN KEY (`id_setor`) REFERENCES `setor` (`id`);

--
-- Limitadores para a tabela `gasto`
--
ALTER TABLE `gasto`
  ADD CONSTRAINT `gasto_ibfk_1` FOREIGN KEY (`id_equipamento`) REFERENCES `equipamento` (`id`),
  ADD CONSTRAINT `gasto_ibfk_2` FOREIGN KEY (`id_arduino`) REFERENCES `arduino` (`id`);

--
-- Limitadores para a tabela `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_pergunta`) REFERENCES `perguntasecreta` (`id`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_setor`) REFERENCES `setor` (`id`),
  ADD CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
