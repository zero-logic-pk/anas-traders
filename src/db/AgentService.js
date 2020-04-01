import BaseService from './BaseService';

export default class AgentService extends BaseService {
    getAll = () => this.runAllQuery('SELECT * FROM "agents" ORDER BY `name`;');

    add = agentData =>
        this.runStatement('INSERT INTO "agents" (name) VALUES(?);', [
            agentData.name
        ]);

    update = agentData =>
        this.runStatement('UPDATE "agents" SET name = ? WHERE id = ?;', [
            agentData.name,
            agentData.id
        ]);

    delete = agentIds =>
        this.runStatement(
            `DELETE FROM "agents" WHERE id IN (${new Array(agentIds.length)
                .fill('?')
                .join(',')});`,
            agentIds
        );
}
