import BaseService from './BaseService';

export default class AgentService extends BaseService {
    getAll = () => this.runAllQuery('SELECT * FROM "agents" ORDER BY `name`;');

    add = agentData => {
        return new Promise((resolve, reject) => {
            const statement = this.prepareStatement(
                'INSERT INTO "agents" (name) VALUES(?);',
                reject
            );
            statement.run(agentData.name);
            this.runStatement(statement, resolve, reject);
        });
    };

    update = agentData => {
        return new Promise((resolve, reject) => {
            const statement = this.prepareStatement(
                'UPDATE "agents" SET name = ? WHERE id = ?;',
                reject
            );
            statement.run(agentData.name, agentData.id);
            this.runStatement(statement, resolve, reject);
        });
    };

    delete = agentIds => {
        return new Promise((resolve, reject) => {
            const statement = this.prepareStatement(
                `DELETE FROM "agents" WHERE id IN (${new Array(agentIds.length)
                    .fill('?')
                    .join(',')});`,
                reject
            );

            statement.run(agentIds);
            this.runStatement(statement, resolve, reject);
        });
    };
}
