import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomAlertModal = ({ show, onClose, title = "Thông báo", message }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="text-center">{message}</div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onClose}>Đóng</Button>
    </Modal.Footer>
  </Modal>
);

export default CustomAlertModal; 