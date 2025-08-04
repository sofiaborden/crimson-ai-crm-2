const PhoneActionButton = ({ phone, donorName, lists }) => {
  const [showListModal, setShowListModal] = useState(false);
  
  return (
    <div className="flex gap-2">
      <Button onClick={() => window.location.href = `tel:${phone}`}>
        📞 Call Now
      </Button>
      <Button onClick={() => setShowListModal(true)}>
        📋 Add to DialR
      </Button>
      {/* Modal for list selection */}
    </div>
  );
};