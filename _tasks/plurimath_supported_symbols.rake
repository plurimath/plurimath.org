require "plurimath"

task :symbols_yaml_file do
  utility = Plurimath::Utility
  symbols_array = []
  utility.symbols_files.each do |file_path|
    file_name = File.basename(file_path, ".rb")
    symbol_object = utility.get_symbol_class(file_name)
    temp_hash = {}
    symbol_object::INPUT.map do |lang, symbols|
      symbols.flatten!
      if symbols.length > 1
        symbols = symbols.delete_if { |sym| sym.start_with?("&#x") }
      end
      temp_hash[lang.to_s] = symbols
    end
    symbols_array << temp_hash
  end
  File.open("_data/symbols_list.yml", "w") { |file| file.write(symbols_array.to_yaml) }
end
