import { mysqlTable, mysqlSchema, AnyMySqlColumn, char, timestamp, customType, int, text, mysqlEnum, varchar, float, tinyint, mediumtext, bigint, mediumblob, smallint, boolean, json, blob, time, primaryKey, index, uniqueIndex, foreignKey } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const innodbIndexStats = mysqlTable("innodb_index_stats", {
	databaseName: varchar("database_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	tableName: varchar("table_name", { length: 199 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	indexName: varchar("index_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	lastUpdate: timestamp("last_update").defaultNow().onUpdateNow().notNull(),
	statName: varchar("stat_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	statValue: bigint("stat_value", { unsigned: true, mode: 'number' }).notNull(),
	sampleSize: bigint("sample_size", { unsigned: true, mode: 'number' }),
	statDescription: varchar("stat_description", { length: 1024 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
},
(table) => [
	primaryKey({ columns: [table.databaseName, table.tableName, table.indexName, table.statName] }),]);

export const innodbTableStats = mysqlTable("innodb_table_stats", {
	databaseName: varchar("database_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	tableName: varchar("table_name", { length: 199 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	lastUpdate: timestamp("last_update").defaultNow().onUpdateNow().notNull(),
	nRows: bigint("n_rows", { unsigned: true, mode: 'number' }).notNull(),
	clusteredIndexSize: bigint("clustered_index_size", { unsigned: true, mode: 'number' }).notNull(),
	sumOfOtherIndexSizes: bigint("sum_of_other_index_sizes", { unsigned: true, mode: 'number' }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.databaseName, table.tableName] }),]);

export const columnsPriv = mysqlTable("columns_priv", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	db: char("Db", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	tableName: char("Table_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	columnName: char("Column_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	timestamp: timestamp("Timestamp").defaultNow().onUpdateNow().notNull(),
	columnPriv: customType({ dataType: () => 'set('select','insert','update','references')' })("Column_priv").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.db, table.tableName, table.columnName] }),]);

export const component = mysqlTable("component", {
	componentId: int("component_id", { unsigned: true }).autoincrement().primaryKey(),
	componentGroupId: int("component_group_id", { unsigned: true }).notNull(),
	componentUrn: text("component_urn").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
});

export const db = mysqlTable("db", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	db: char("Db", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	selectPriv: mysqlEnum("Select_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	insertPriv: mysqlEnum("Insert_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	updatePriv: mysqlEnum("Update_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	deletePriv: mysqlEnum("Delete_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createPriv: mysqlEnum("Create_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	dropPriv: mysqlEnum("Drop_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	grantPriv: mysqlEnum("Grant_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	referencesPriv: mysqlEnum("References_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	indexPriv: mysqlEnum("Index_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	alterPriv: mysqlEnum("Alter_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createTmpTablePriv: mysqlEnum("Create_tmp_table_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	lockTablesPriv: mysqlEnum("Lock_tables_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createViewPriv: mysqlEnum("Create_view_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	showViewPriv: mysqlEnum("Show_view_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createRoutinePriv: mysqlEnum("Create_routine_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	alterRoutinePriv: mysqlEnum("Alter_routine_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	executePriv: mysqlEnum("Execute_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	eventPriv: mysqlEnum("Event_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	triggerPriv: mysqlEnum("Trigger_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.db] }),	index("User").on(table.user),
]);

export const defaultRoles = mysqlTable("default_roles", {
	host: char("HOST", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	user: char("USER", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	defaultROLEHOST: char("DEFAULT_ROLE_HOST", { length: 255 }).default("%").charSet("ascii").collate("ascii_general_ci").notNull(),
	defaultROLEUSER: char("DEFAULT_ROLE_USER", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.defaultROLEHOST, table.defaultROLEUSER] }),]);

export const func = mysqlTable("func", {
	name: char({ length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").primaryKey(),
	ret: tinyint().default(0).notNull(),
	dl: char({ length: 128 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	type: mysqlEnum(["function","aggregate"]).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
});

export const generalLog = mysqlTable("general_log", {
	eventTime: timestamp("event_time", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).onUpdateNow({ fsp: 6 }).notNull(),
	userHost: mediumtext("user_host").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	threadId: bigint("thread_id", { unsigned: true, mode: 'number' }).notNull(),
	serverId: int("server_id", { unsigned: true }).notNull(),
	commandType: varchar("command_type", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	argument: mediumblob().notNull(),
});

export const globalGrants = mysqlTable("global_grants", {
	user: char("USER", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	host: char("HOST", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	priv: char("PRIV", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	withGRANTOPTION: mysqlEnum("WITH_GRANT_OPTION", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.user, table.host, table.priv] }),]);

export const gtidExecuted = mysqlTable("gtid_executed", {
	sourceUuid: char("source_uuid", { length: 36 }).notNull(),
	intervalStart: bigint("interval_start", { mode: 'number' }).notNull(),
	intervalEnd: bigint("interval_end", { mode: 'number' }).notNull(),
	gtidTag: char("gtid_tag", { length: 32 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.sourceUuid, table.gtidTag, table.intervalStart] }),]);

export const helpCategory = mysqlTable("help_category", {
	helpCategoryId: smallint("help_category_id", { unsigned: true }).primaryKey(),
	name: char({ length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	parentCategoryId: smallint("parent_category_id", { unsigned: true }),
	url: text().charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	uniqueIndex("name").on(table.name),
]);

export const helpKeyword = mysqlTable("help_keyword", {
	helpKeywordId: int("help_keyword_id", { unsigned: true }).primaryKey(),
	name: char({ length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	uniqueIndex("name").on(table.name),
]);

export const helpRelation = mysqlTable("help_relation", {
	helpTopicId: int("help_topic_id", { unsigned: true }).notNull(),
	helpKeywordId: int("help_keyword_id", { unsigned: true }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.helpKeywordId, table.helpTopicId] }),]);

export const helpTopic = mysqlTable("help_topic", {
	helpTopicId: int("help_topic_id", { unsigned: true }).primaryKey(),
	name: char({ length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	helpCategoryId: smallint("help_category_id", { unsigned: true }).notNull(),
	description: text().charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	example: text().charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	url: text().charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	uniqueIndex("name").on(table.name),
]);

export const passwordHistory = mysqlTable("password_history", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	passwordTimestamp: timestamp("Password_timestamp", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).notNull(),
	password: text("Password").charSet("utf8mb3").collate("utf8mb3_bin"),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.passwordTimestamp] }),]);

export const plugin = mysqlTable("plugin", {
	name: varchar({ length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").primaryKey(),
	dl: varchar({ length: 128 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
});

export const procsPriv = mysqlTable("procs_priv", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	db: char("Db", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	routineName: char("Routine_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	routineType: mysqlEnum("Routine_type", ["FUNCTION","PROCEDURE","LIBRARY"]).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	grantor: varchar("Grantor", { length: 288 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	procPriv: customType({ dataType: () => 'set('execute','alter routine','grant')' })("Proc_priv").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	timestamp: timestamp("Timestamp").defaultNow().onUpdateNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.db, table.routineName, table.routineType] }),	index("Grantor").on(table.grantor),
]);

export const roleEdges = mysqlTable("role_edges", {
	fromHOST: char("FROM_HOST", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	fromUSER: char("FROM_USER", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	toHOST: char("TO_HOST", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	toUSER: char("TO_USER", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	withADMINOPTION: mysqlEnum("WITH_ADMIN_OPTION", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.fromHOST, table.fromUSER, table.toHOST, table.toUSER] }),]);

export const servers = mysqlTable("servers", {
	serverName: char("Server_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").primaryKey(),
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	db: char("Db", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	username: char("Username", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	password: char("Password", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	port: int("Port").default(0).notNull(),
	socket: char("Socket", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	wrapper: char("Wrapper", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	owner: char("Owner", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
});

export const slaveMasterInfo = mysqlTable("slave_master_info", {
	numberOfLines: int("Number_of_lines", { unsigned: true }).notNull(),
	masterLogName: text("Master_log_name").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	masterLogPos: bigint("Master_log_pos", { unsigned: true, mode: 'number' }).notNull(),
	host: varchar("Host", { length: 255 }).charSet("ascii").collate("ascii_general_ci"),
	userName: text("User_name").charSet("utf8mb3").collate("utf8mb3_bin"),
	userPassword: text("User_password").charSet("utf8mb3").collate("utf8mb3_bin"),
	port: int("Port", { unsigned: true }).notNull(),
	connectRetry: int("Connect_retry", { unsigned: true }).notNull(),
	enabledSsl: boolean("Enabled_ssl").notNull(),
	sslCa: text("Ssl_ca").charSet("utf8mb3").collate("utf8mb3_bin"),
	sslCapath: text("Ssl_capath").charSet("utf8mb3").collate("utf8mb3_bin"),
	sslCert: text("Ssl_cert").charSet("utf8mb3").collate("utf8mb3_bin"),
	sslCipher: text("Ssl_cipher").charSet("utf8mb3").collate("utf8mb3_bin"),
	sslKey: text("Ssl_key").charSet("utf8mb3").collate("utf8mb3_bin"),
	sslVerifyServerCert: boolean("Ssl_verify_server_cert").notNull(),
	heartbeat: float("Heartbeat").notNull(),
	bind: text("Bind").charSet("utf8mb3").collate("utf8mb3_bin"),
	ignoredServerIds: text("Ignored_server_ids").charSet("utf8mb3").collate("utf8mb3_bin"),
	uuid: text("Uuid").charSet("utf8mb3").collate("utf8mb3_bin"),
	retryCount: bigint("Retry_count", { unsigned: true, mode: 'number' }).notNull(),
	sslCrl: text("Ssl_crl").charSet("utf8mb3").collate("utf8mb3_bin"),
	sslCrlpath: text("Ssl_crlpath").charSet("utf8mb3").collate("utf8mb3_bin"),
	enabledAutoPosition: boolean("Enabled_auto_position").notNull(),
	channelName: varchar("Channel_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").primaryKey(),
	tlsVersion: text("Tls_version").charSet("utf8mb3").collate("utf8mb3_bin"),
	publicKeyPath: text("Public_key_path").charSet("utf8mb3").collate("utf8mb3_bin"),
	getPublicKey: boolean("Get_public_key").notNull(),
	networkNamespace: text("Network_namespace").charSet("utf8mb3").collate("utf8mb3_bin"),
	masterCompressionAlgorithm: varchar("Master_compression_algorithm", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	masterZstdCompressionLevel: int("Master_zstd_compression_level", { unsigned: true }).notNull(),
	tlsCiphersuites: text("Tls_ciphersuites").charSet("utf8mb3").collate("utf8mb3_bin"),
	sourceConnectionAutoFailover: boolean("Source_connection_auto_failover").default(false).notNull(),
	gtidOnly: boolean("Gtid_only").default(false).notNull(),
});

export const slaveRelayLogInfo = mysqlTable("slave_relay_log_info", {
	numberOfLines: int("Number_of_lines", { unsigned: true }).notNull(),
	relayLogName: text("Relay_log_name").charSet("utf8mb3").collate("utf8mb3_bin"),
	relayLogPos: bigint("Relay_log_pos", { unsigned: true, mode: 'number' }),
	masterLogName: text("Master_log_name").charSet("utf8mb3").collate("utf8mb3_bin"),
	masterLogPos: bigint("Master_log_pos", { unsigned: true, mode: 'number' }),
	sqlDelay: int("Sql_delay"),
	numberOfWorkers: int("Number_of_workers", { unsigned: true }),
	id: int("Id", { unsigned: true }),
	channelName: varchar("Channel_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").primaryKey(),
	privilegeChecksUsername: varchar("Privilege_checks_username", { length: 32 }).charSet("utf8mb3").collate("utf8mb3_bin"),
	privilegeChecksHostname: varchar("Privilege_checks_hostname", { length: 255 }).charSet("ascii").collate("ascii_general_ci"),
	requireRowFormat: boolean("Require_row_format").notNull(),
	requireTablePrimaryKeyCheck: mysqlEnum("Require_table_primary_key_check", ["STREAM","ON","OFF","GENERATE"]).default("STREAM").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	assignGtidsToAnonymousTransactionsType: mysqlEnum("Assign_gtids_to_anonymous_transactions_type", ["OFF","LOCAL","UUID"]).default("OFF").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	assignGtidsToAnonymousTransactionsValue: text("Assign_gtids_to_anonymous_transactions_value").charSet("utf8mb3").collate("utf8mb3_bin"),
	applierVersion: int("Applier_version", { unsigned: true }).default(1).notNull(),
	applierWorkerCount: int("Applier_worker_count", { unsigned: true }).default(0).notNull(),
	applierEventMemoryLimit: int("Applier_event_memory_limit", { unsigned: true }).default(1073741824).notNull(),
});

export const slaveWorkerInfo = mysqlTable("slave_worker_info", {
	id: int("Id", { unsigned: true }).notNull(),
	relayLogName: text("Relay_log_name").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	relayLogPos: bigint("Relay_log_pos", { unsigned: true, mode: 'number' }).notNull(),
	masterLogName: text("Master_log_name").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	masterLogPos: bigint("Master_log_pos", { unsigned: true, mode: 'number' }).notNull(),
	checkpointRelayLogName: text("Checkpoint_relay_log_name").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	checkpointRelayLogPos: bigint("Checkpoint_relay_log_pos", { unsigned: true, mode: 'number' }).notNull(),
	checkpointMasterLogName: text("Checkpoint_master_log_name").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	checkpointMasterLogPos: bigint("Checkpoint_master_log_pos", { unsigned: true, mode: 'number' }).notNull(),
	checkpointSeqno: int("Checkpoint_seqno", { unsigned: true }).notNull(),
	checkpointGroupSize: int("Checkpoint_group_size", { unsigned: true }).notNull(),
	checkpointGroupBitmap: blob("Checkpoint_group_bitmap").notNull(),
	channelName: varchar("Channel_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.channelName, table.id] }),]);

export const slowLog = mysqlTable("slow_log", {
	startTime: timestamp("start_time", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).onUpdateNow({ fsp: 6 }).notNull(),
	userHost: mediumtext("user_host").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	queryTime: time("query_time", { fsp: 6 }).notNull(),
	lockTime: time("lock_time", { fsp: 6 }).notNull(),
	rowsSent: int("rows_sent").notNull(),
	rowsExamined: int("rows_examined").notNull(),
	db: varchar({ length: 512 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	lastInsertId: int("last_insert_id").notNull(),
	insertId: int("insert_id").notNull(),
	serverId: int("server_id", { unsigned: true }).notNull(),
	sqlText: mediumblob("sql_text").notNull(),
	threadId: bigint("thread_id", { unsigned: true, mode: 'number' }).notNull(),
});

export const tablesPriv = mysqlTable("tables_priv", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	db: char("Db", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	tableName: char("Table_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	grantor: varchar("Grantor", { length: 288 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	timestamp: timestamp("Timestamp").defaultNow().onUpdateNow().notNull(),
	tablePriv: customType({ dataType: () => 'set('select','insert','update','delete','create','drop','grant','references','index','alter','create view','show view','trigger')' })("Table_priv").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	columnPriv: customType({ dataType: () => 'set('select','insert','update','references')' })("Column_priv").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.db, table.tableName] }),	index("Grantor").on(table.grantor),
]);

export const timeZone = mysqlTable("time_zone", {
	timeZoneId: int("Time_zone_id", { unsigned: true }).autoincrement().primaryKey(),
	useLeapSeconds: mysqlEnum("Use_leap_seconds", ["Y","N"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
});

export const timeZoneLeapSecond = mysqlTable("time_zone_leap_second", {
	transitionTime: bigint("Transition_time", { mode: 'number' }).primaryKey(),
	correction: int("Correction").notNull(),
});

export const timeZoneName = mysqlTable("time_zone_name", {
	name: char("Name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").primaryKey(),
	timeZoneId: int("Time_zone_id", { unsigned: true }).notNull(),
});

export const timeZoneTransition = mysqlTable("time_zone_transition", {
	timeZoneId: int("Time_zone_id", { unsigned: true }).notNull(),
	transitionTime: bigint("Transition_time", { mode: 'number' }).notNull(),
	transitionTypeId: int("Transition_type_id", { unsigned: true }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.timeZoneId, table.transitionTime] }),]);

export const timeZoneTransitionType = mysqlTable("time_zone_transition_type", {
	timeZoneId: int("Time_zone_id", { unsigned: true }).notNull(),
	transitionTypeId: int("Transition_type_id", { unsigned: true }).notNull(),
	offset: int("Offset").default(0).notNull(),
	isDST: tinyint("Is_DST", { unsigned: true }).default(0).notNull(),
	abbreviation: char("Abbreviation", { length: 8 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.timeZoneId, table.transitionTypeId] }),]);

export const user = mysqlTable("user", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	selectPriv: mysqlEnum("Select_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	insertPriv: mysqlEnum("Insert_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	updatePriv: mysqlEnum("Update_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	deletePriv: mysqlEnum("Delete_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createPriv: mysqlEnum("Create_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	dropPriv: mysqlEnum("Drop_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	reloadPriv: mysqlEnum("Reload_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	shutdownPriv: mysqlEnum("Shutdown_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	processPriv: mysqlEnum("Process_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	filePriv: mysqlEnum("File_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	grantPriv: mysqlEnum("Grant_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	referencesPriv: mysqlEnum("References_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	indexPriv: mysqlEnum("Index_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	alterPriv: mysqlEnum("Alter_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	showDbPriv: mysqlEnum("Show_db_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	superPriv: mysqlEnum("Super_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createTmpTablePriv: mysqlEnum("Create_tmp_table_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	lockTablesPriv: mysqlEnum("Lock_tables_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	executePriv: mysqlEnum("Execute_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	replSlavePriv: mysqlEnum("Repl_slave_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	replClientPriv: mysqlEnum("Repl_client_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createViewPriv: mysqlEnum("Create_view_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	showViewPriv: mysqlEnum("Show_view_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createRoutinePriv: mysqlEnum("Create_routine_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	alterRoutinePriv: mysqlEnum("Alter_routine_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createUserPriv: mysqlEnum("Create_user_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	eventPriv: mysqlEnum("Event_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	triggerPriv: mysqlEnum("Trigger_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createTablespacePriv: mysqlEnum("Create_tablespace_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	sslType: mysqlEnum("ssl_type", ["","ANY","X509","SPECIFIED"]).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	sslCipher: blob("ssl_cipher").notNull(),
	x509Issuer: blob("x509_issuer").notNull(),
	x509Subject: blob("x509_subject").notNull(),
	maxQuestions: int("max_questions", { unsigned: true }).default(0).notNull(),
	maxUpdates: int("max_updates", { unsigned: true }).default(0).notNull(),
	maxConnections: int("max_connections", { unsigned: true }).default(0).notNull(),
	maxUserConnections: int("max_user_connections", { unsigned: true }).default(0).notNull(),
	plugin: char({ length: 64 }).default("caching_sha2_password").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	authenticationString: text("authentication_string").charSet("utf8mb3").collate("utf8mb3_bin"),
	passwordExpired: mysqlEnum("password_expired", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	passwordLastChanged: timestamp("password_last_changed"),
	passwordLifetime: smallint("password_lifetime", { unsigned: true }),
	accountLocked: mysqlEnum("account_locked", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	createRolePriv: mysqlEnum("Create_role_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	dropRolePriv: mysqlEnum("Drop_role_priv", ["N","Y"]).default("N").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	passwordReuseHistory: smallint("Password_reuse_history", { unsigned: true }),
	passwordReuseTime: smallint("Password_reuse_time", { unsigned: true }),
	passwordRequireCurrent: mysqlEnum("Password_require_current", ["N","Y"]).charSet("utf8mb3").collate("utf8mb3_general_ci"),
	userAttributes: json("User_attributes"),
},
(table) => [
	primaryKey({ columns: [table.host, table.user] }),]);

export const engineCost = mysqlTable("engine_cost", {
	engineName: varchar("engine_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	deviceType: int("device_type").notNull(),
	costName: varchar("cost_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	costValue: float("cost_value"),
	lastUpdate: timestamp("last_update").defaultNow().onUpdateNow().notNull(),
	comment: varchar({ length: 1024 }).charSet("utf8mb3").collate("utf8mb3_general_ci"),
	defaultValue: float("default_value").generatedAlwaysAs(sql`(case \`cost_name\` when _utf8mb4\'io_block_read_cost\' then 1.0 when _utf8mb4\'memory_block_read_cost\' then 0.25 else NULL end)`, { mode: "virtual" }),
},
(table) => [
	primaryKey({ columns: [table.costName, table.engineName, table.deviceType] }),]);

export const ndbBinlogIndex = mysqlTable("ndb_binlog_index", {
	position: bigint("Position", { unsigned: true, mode: 'number' }).notNull(),
	file: varchar("File", { length: 255 }).charSet("latin1").collate("latin1_swedish_ci").notNull(),
	epoch: bigint({ unsigned: true, mode: 'number' }).notNull(),
	inserts: int({ unsigned: true }).notNull(),
	updates: int({ unsigned: true }).notNull(),
	deletes: int({ unsigned: true }).notNull(),
	schemaops: int({ unsigned: true }).notNull(),
	origServerId: int("orig_server_id", { unsigned: true }).notNull(),
	origEpoch: bigint("orig_epoch", { unsigned: true, mode: 'number' }).notNull(),
	gci: int({ unsigned: true }).notNull(),
	nextPosition: bigint("next_position", { unsigned: true, mode: 'number' }).notNull(),
	nextFile: varchar("next_file", { length: 255 }).charSet("latin1").collate("latin1_swedish_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.epoch, table.origServerId, table.origEpoch] }),]);

export const proxiesPriv = mysqlTable("proxies_priv", {
	host: char("Host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	user: char("User", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	proxiedHost: char("Proxied_host", { length: 255 }).default("").charSet("ascii").collate("ascii_general_ci").notNull(),
	proxiedUser: char("Proxied_user", { length: 32 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	withGrant: boolean("With_grant").default(false).notNull(),
	grantor: varchar("Grantor", { length: 288 }).default("").charSet("utf8mb3").collate("utf8mb3_bin").notNull(),
	timestamp: timestamp("Timestamp").defaultNow().onUpdateNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.host, table.user, table.proxiedHost, table.proxiedUser] }),	index("Grantor").on(table.grantor),
]);

export const replicationAsynchronousConnectionFailover = mysqlTable("replication_asynchronous_connection_failover", {
	channelName: char("Channel_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	host: char("Host", { length: 255 }).charSet("ascii").collate("ascii_general_ci").notNull(),
	port: int("Port", { unsigned: true }).notNull(),
	networkNamespace: char("Network_namespace", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	weight: tinyint("Weight", { unsigned: true }).notNull(),
	managedName: char("Managed_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.channelName, table.host, table.port, table.networkNamespace, table.managedName] }),	index("Channel_name").on(table.channelName, table.managedName),
]);

export const replicationAsynchronousConnectionFailoverManaged = mysqlTable("replication_asynchronous_connection_failover_managed", {
	channelName: char("Channel_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	managedName: char("Managed_name", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	managedType: char("Managed_type", { length: 64 }).default("").charSet("utf8mb3").collate("utf8mb3_general_ci").notNull(),
	configuration: json("Configuration"),
},
(table) => [
	primaryKey({ columns: [table.channelName, table.managedName] }),]);

export const replicationGroupConfigurationVersion = mysqlTable("replication_group_configuration_version", {
	name: char({ length: 255 }).charSet("ascii").collate("ascii_general_ci").primaryKey(),
	version: bigint({ unsigned: true, mode: 'number' }).notNull(),
});

export const replicationGroupMemberActions = mysqlTable("replication_group_member_actions", {
	name: char({ length: 255 }).charSet("ascii").collate("ascii_general_ci").notNull(),
	event: char({ length: 64 }).charSet("ascii").collate("ascii_general_ci").notNull(),
	enabled: boolean().notNull(),
	type: char({ length: 64 }).charSet("ascii").collate("ascii_general_ci").notNull(),
	priority: tinyint({ unsigned: true }).notNull(),
	errorHandling: char("error_handling", { length: 64 }).charSet("ascii").collate("ascii_general_ci").notNull(),
},
(table) => [
	primaryKey({ columns: [table.name, table.event] }),	index("event").on(table.event),
]);

export const serverCost = mysqlTable("server_cost", {
	costName: varchar("cost_name", { length: 64 }).charSet("utf8mb3").collate("utf8mb3_general_ci").primaryKey(),
	costValue: float("cost_value"),
	lastUpdate: timestamp("last_update").defaultNow().onUpdateNow().notNull(),
	comment: varchar({ length: 1024 }).charSet("utf8mb3").collate("utf8mb3_general_ci"),
	defaultValue: float("default_value").generatedAlwaysAs(sql`(case \`cost_name\` when _utf8mb4\'disk_temptable_create_cost\' then 20.0 when _utf8mb4\'disk_temptable_row_cost\' then 0.5 when _utf8mb4\'key_compare_cost\' then 0.05 when _utf8mb4\'memory_temptable_create_cost\' then 1.0 when _utf8mb4\'memory_temptable_row_cost\' then 0.1 when _utf8mb4\'row_evaluate_cost\' then 0.1 else NULL end)`, { mode: "virtual" }),
});

export const usersTable = mysqlTable("users_table", {
	id: int().autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	age: int().notNull(),
	email: varchar({ length: 255 }).notNull(),
},
(table) => [
	uniqueIndex("email_unique").on(table.email),
]);

export const roles = mysqlTable("roles", {
	id: int().autoincrement().primaryKey(),
	role: varchar({ length: 64 }).notNull(),
	updatedAt: timestamp("updated_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().primaryKey(),
	username: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	salt: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp("updated_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
	roleId: int("role_id").notNull().references(() => roles.id),
},
(table) => [
	uniqueIndex("email_unique").on(table.email),
]);
