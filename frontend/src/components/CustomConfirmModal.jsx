import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomConfirmModal = ({ show, onClose, onConfirm, title = "Xác nhận", message, confirmText = "Xác nhận", cancelText = "Hủy" }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="text-center">{message}</div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
      <Button variant="danger" onClick={onConfirm}>{confirmText}</Button>
    </Modal.Footer>
  </Modal>
);

export default CustomConfirmModal; 