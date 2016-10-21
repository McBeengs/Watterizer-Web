-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 20-Out-2016 às 20:29
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

--
-- Extraindo dados da tabela `advertencia`
--

INSERT INTO `advertencia` (`id`, `id_usuario`, `titulo`, `mensagem`, `data`) VALUES
(1, 2, 'asd', 'asd', '2016-10-05 00:00:00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `arduino`
--

CREATE TABLE `arduino` (
  `id` int(11) NOT NULL,
  `id_setor` int(11) NOT NULL,
  `localizacao` varchar(50) NOT NULL,
  `id_computador_responsavel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `arduino`
--

INSERT INTO `arduino` (`id`, `id_setor`, `localizacao`, `id_computador_responsavel`) VALUES
(1, 1, 'asdasd', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `canvas`
--

CREATE TABLE `canvas` (
  `id` int(11) NOT NULL,
  `codificacao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `id_arduino` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `equipamento`
--

INSERT INTO `equipamento` (`id`, `mac`, `nome`, `descricao`, `posicionado`, `id_arduino`) VALUES
(1, '70-54-D2-C6-A7-7E', 'LAB10-07', '', 0, 1),
(9, 'asdasdasd', 'asdasd', 'asdasd', 0, 1),
(11, 'drtydrty', 'yryh', 'dfyhdy', 0, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `gasto`
--

CREATE TABLE `gasto` (
  `id` int(11) NOT NULL,
  `gasto` blob NOT NULL,
  `data` date NOT NULL,
  `id_arduino` int(11) NOT NULL,
  `ultimo_update` time NOT NULL,
  `id_equipamento` int(11) DEFAULT NULL
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
(1, 'administrador');

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
(1, 'Tudo bem?');

-- --------------------------------------------------------

--
-- Estrutura da tabela `setor`
--

CREATE TABLE `setor` (
  `id` int(11) NOT NULL,
  `setor` varchar(255) NOT NULL,
  `id_canvas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `setor`
--

INSERT INTO `setor` (`id`, `setor`, `id_canvas`) VALUES
(1, 'ghughugu', NULL);

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
(2, 'admin', 'WCwLwn04k8xqKrTWuBCx8Q==', 'asd', 'asd', 'asd', '13:00:00', 1, 1, 1, 'asd', 'TbHnCQjPAshFetTM', 'wICNSR971fuRzORe', '17:00:00', '15:00:00', NULL);

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
-- Indexes for table `canvas`
--
ALTER TABLE `canvas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `equipamento`
--
ALTER TABLE `equipamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_arduino` (`id_arduino`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_canvas` (`id_canvas`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `arduino`
--
ALTER TABLE `arduino`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `canvas`
--
ALTER TABLE `canvas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `equipamento`
--
ALTER TABLE `equipamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `gasto`
--
ALTER TABLE `gasto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `perfil`
--
ALTER TABLE `perfil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `perguntasecreta`
--
ALTER TABLE `perguntasecreta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `setor`
--
ALTER TABLE `setor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `advertencia`
--
ALTER TABLE `advertencia`
  ADD CONSTRAINT `advertencia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `arduino`
--
ALTER TABLE `arduino`
  ADD CONSTRAINT `arduino_ibfk_1` FOREIGN KEY (`id_setor`) REFERENCES `setor` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `arduino_ibfk_2` FOREIGN KEY (`id_computador_responsavel`) REFERENCES `equipamento` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `equipamento`
--
ALTER TABLE `equipamento`
  ADD CONSTRAINT `equipamento_ibfk_1` FOREIGN KEY (`id_arduino`) REFERENCES `arduino` (`id`) ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `gasto`
--
ALTER TABLE `gasto`
  ADD CONSTRAINT `gasto_ibfk_1` FOREIGN KEY (`id_arduino`) REFERENCES `arduino` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `gasto_ibfk_2` FOREIGN KEY (`id_equipamento`) REFERENCES `equipamento` (`id`) ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `setor`
--
ALTER TABLE `setor`
  ADD CONSTRAINT `setor_ibfk_1` FOREIGN KEY (`id_canvas`) REFERENCES `canvas` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_pergunta`) REFERENCES `perguntasecreta` (`id`),
  ADD CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `usuario_ibfk_4` FOREIGN KEY (`id_setor`) REFERENCES `setor` (`id`) ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
