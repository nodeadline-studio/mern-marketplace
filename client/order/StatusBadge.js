
export default function StatusBadge({ status }) {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-600 border-green-200'
      case 'pending':
      case 'in_progress':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'delivered':
        return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-600 border-red-200'
      case 'draft':
      case 'paused':
        return 'bg-gray-100 text-gray-500 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-400 border-gray-100'
    }
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(status)}`}>
      {status?.replace('_', ' ') || 'Unknown'}
    </span>
  )
}
