interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const models = [
    { value: 'github_grok', label: 'GitHub Grok 3 Mini' },
    { value: 'aliyun_qwen', label: '阿里云百炼 Qwen-Flash' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-3">
        <label htmlFor="model-select" className="text-sm font-medium text-gray-700">
          选择模型：
        </label>
        <select
          id="model-select"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
        >
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}