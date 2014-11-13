module Fluent
  class MongoTimezoneOutput < MongoOutput
    Plugin.register_output('mongo_timezone', self)
 
    # offset to UTC (in hour)
    config_param :utcoffset, :integer, :default => 0
 
    def collect_records(chunk)
      records = []
      chunk.msgpack_each { |time, record|
        # add utcoffset to timestamp of UTC to pretend to act as your timezone
        record[@time_key] = Time.at(time || record[@time_key]) + @utcoffset * 3600 if @include_time_key
        records << record
      }
      records
    end
  end
end