import { motion } from "framer-motion";

type DeletePropsType = {
  isOpen: boolean,
  onClose: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const DeleteProjectModal = ({ isOpen, onClose, onConfirm }: DeletePropsType) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-neutral-100 dark:bg-neutral-950/30 backdrop-blur-md p-6 rounded-lg shadow-lg w-96 "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => onClose}
          >Cancel</button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteProjectModal;
